import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, Trash2, Mic, Square, PlayCircle, Clock, Activity, Globe, RefreshCcw } from 'lucide-react';

// My backend render url
const API_URL = "https://transcriber-backend-2-i4kr.onrender.com";

const Dashboard = () => {
  // --- STATE ---
  const [mode, setMode] = useState("upload"); // 'upload' or 'record'
  const [file, setFile] = useState(null);     // Stores the File or Blob
  
  // Language State
  const [languages, setLanguages] = useState({}); 
  const [targetLang, setTargetLang] = useState("en");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false); // Specific for text translation
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  // --- RECORDING STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  
  // --- VISUALIZER STATE ---
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Fetch supported languages on load
    const fetchLanguages = async () => {
        try {
            const res = await axios.get(`${API_URL}/languages`);
            setLanguages(res.data);
        } catch (err) {
            console.error("Failed to fetch languages", err);
            // Fallback if API fails
            setLanguages({ "English": "en", "Spanish": "es", "French": "fr" });
        }
    };
    fetchLanguages();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // --- HELPERS ---
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetState = () => {
    setFile(null);
    setAudioUrl(null);
    setData(null);
    setError("");
    setRecordingTime(0);
  };

  // --- HANDLERS: UPLOAD ---
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        resetState();
        setFile(selected);
        setAudioUrl(URL.createObjectURL(selected));
    }
  };

  // --- HANDLERS: RECORDING ---
  const startRecording = async () => {
    resetState();
    setError("");
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Visualizer
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      
      // Setup Recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setFile(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      drawWaveform();

    } catch (err) {
      console.error(err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // --- VISUALIZER LOGIC ---
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#1e1e1e';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#646cff';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if(i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };
    draw();
  };

  // --- API: FULL TRANSCRIPTION ---
  const handleTranscribe = async () => {
    if (!file) return setError("Please upload a file or record audio.");
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    const filename = file.name || "mic_recording.webm"; 
    formData.append("file", file, filename);
    formData.append("target_lang", targetLang);
    formData.append("return_timestamps", "true");

    try {
      const response = await axios.post(`${API_URL}/transcribe`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Transcription failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- API: TEXT TRANSLATION ONLY (NEW FEATURE) ---
  const handleReTranslate = async () => {
    if (!data?.original_text) return;
    setIsTranslating(true);
    
    try {
        const response = await axios.post(`${API_URL}/translate-text`, {
            text: data.original_text,
            target_lang: targetLang
        });
        
        // Update state with new translation without losing audio data
        setData(prev => ({
            ...prev,
            translated_text: response.data.translated_text,
            target_lang: response.data.target_lang
        }));
    } catch (err) {
        alert("Translation failed");
    } finally {
        setIsTranslating(false);
    }
  };

  const handleDelete = async () => {
    if (!data?.file_id) return;
    if (!window.confirm("Delete file from server?")) return;
    try {
      await axios.delete(`${API_URL}/files/${data.file_id}`);
      resetState();
      alert("File deleted.");
    } catch { alert("Error deleting."); }
  };

  return (
    <div className="page-container">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p>Transcribe, Record, and Translate into 100+ Languages.</p>
      </header>

      {/* --- TABS --- */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
            className={`btn-primary ${mode === 'upload' ? '' : 'inactive'}`} 
            style={{ opacity: mode === 'upload' ? 1 : 0.5 }}
            onClick={() => { setMode('upload'); resetState(); }}
        >
            <Upload size={18} style={{marginRight:8}}/> Upload File
        </button>
        <button 
            className={`btn-primary ${mode === 'record' ? '' : 'inactive'}`}
            style={{ opacity: mode === 'record' ? 1 : 0.5 }}
            onClick={() => { setMode('record'); resetState(); }}
        >
            <Mic size={18} style={{marginRight:8}}/> Record Audio
        </button>
      </div>

      <div className="upload-box">
        
        {/* --- MODE: UPLOAD --- */}
        {mode === 'upload' && (
            <div className="file-input-wrapper">
                <label htmlFor="file-upload" className="custom-file-upload">
                    <Upload size={24} /> 
                    <span>{file ? file.name : "Click to Upload Audio File"}</span>
                </label>
                <input id="file-upload" type="file" accept="audio/*" onChange={handleFileChange} />
            </div>
        )}

        {/* --- MODE: RECORD --- */}
        {mode === 'record' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <canvas 
                    ref={canvasRef} 
                    width="400" 
                    height="100" 
                    style={{ 
                        width: '100%', 
                        maxWidth: '500px', 
                        height: '100px', 
                        background: '#1e1e1e', 
                        borderRadius: '8px',
                        border: '1px solid #333'
                    }} 
                />

                <div className="timer" style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: isRecording ? '#ff4d4d' : '#fff' }}>
                    <Clock size={20} style={{ display: 'inline', marginRight: 8 }} />
                    {formatTime(recordingTime)}
                </div>

                {!isRecording ? (
                    <button onClick={startRecording} className="btn-primary" style={{ background: '#ef4444' }}>
                        <Mic size={18} style={{ marginRight: 8 }} /> Start Recording
                    </button>
                ) : (
                    <button onClick={stopRecording} className="btn-primary">
                        <Square size={18} style={{ marginRight: 8 }} /> Stop Recording
                    </button>
                )}
            </div>
        )}

        {/* --- CONTROLS ROW --- */}
        <div className="controls-row" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
          
          <div style={{display:'flex', alignItems:'center', gap:'10px', flex: 1}}>
            <Globe size={20} color="#666" />
            <select 
                value={targetLang} 
                onChange={(e) => setTargetLang(e.target.value)} 
                className="lang-select" 
                style={{ width: '100%', textTransform: 'capitalize' }}
            >
                <option value="en">English (Default)</option>
                {/* Dynamically Map Languages from Backend */}
                {Object.entries(languages)
                    .sort((a,b) => a[0].localeCompare(b[0])) // Sort alphabetically
                    .map(([name, code]) => (
                    <option key={code} value={code}>{name}</option>
                ))}
            </select>
          </div>
          
          <button 
            onClick={handleTranscribe} 
            disabled={!file || isLoading || isRecording} 
            className="btn-primary"
          >
            {isLoading ? <Activity className="animate-spin" /> : <PlayCircle size={18} style={{ marginRight: 8 }} />}
            {isLoading ? " Processing..." : "Start Transcription"}
          </button>
        </div>

        {error && <p style={{ color: '#ff4d4d', marginTop: '1rem' }}>{error}</p>}
      </div>

      {/* --- RESULTS SECTION --- */}
      {data && (
        <div className="results-area animate-fade-in">
          <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <h3>Results</h3>
                 <button onClick={handleDelete} className="logout-btn" style={{ width: 'auto', padding: '0.5rem' }}>
                     <Trash2 size={18} />
                 </button>
              </div>
              
              {audioUrl && (
                  <audio controls src={audioUrl} style={{ width: '100%', marginBottom: '1.5rem', borderRadius: '8px' }} />
              )}

              <div className="grid-2">
                {/* Original Text */}
                <div className="text-card">
                    <h4 style={{ color: '#a1a1aa', marginBottom: '0.5rem' }}>Original Text</h4>
                    <p style={{ lineHeight: '1.6' }}>{data.original_text}</p>
                </div>

                {/* Translated Text (With Update Button) */}
                <div className="text-card" style={{ position: 'relative' }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>
                            Translation ({targetLang})
                        </h4>
                        
                        {/* Instant Re-Translate Button */}
                        <button 
                            onClick={handleReTranslate} 
                            disabled={isTranslating}
                            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--primary)'}}
                            title="Update translation to selected language"
                        >
                            <RefreshCcw size={16} className={isTranslating ? "animate-spin" : ""} />
                        </button>
                    </div>
                    
                    <p style={{ lineHeight: '1.6' }}>{data.translated_text}</p>
                </div>
              </div>

              <div className="timestamps-area" style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: '#a1a1aa', marginBottom: '0.5rem' }}>Word Timestamps</h4>
                <div className="tags">
                    {data.word_timestamps?.map((t, i) => (
                        <span key={i} className="tag">
                            {t.word} <small>{t.start.toFixed(1)}s</small>
                        </span>
                    ))}
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;