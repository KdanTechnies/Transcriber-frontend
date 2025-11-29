import { useState } from 'react';
import axios from 'axios';
import { Upload, Trash2, PlayCircle, FileAudio } from 'lucide-react';

const API_URL = "https://transcriber-backend-2-i4kr.onrender.com"

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [targetLang, setTargetLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        setFile(selected);
        setAudioUrl(URL.createObjectURL(selected));
        setData(null);
        setError("");
    }
  };

  const handleTranscribe = async () => {
    if (!file) return setError("Please select a file.");
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
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

  const handleDelete = async () => {
    if (!data?.file_id) return;
    if (!window.confirm("Delete file from server?")) return;
    try {
      await axios.delete(`${API_URL}/files/${data.file_id}`);
      setData(null); setFile(null); setAudioUrl(null);
      alert("File deleted.");
    } catch { alert("Error deleting."); }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Transcribe and translate your audio files.</p>
      </header>

      <div className="upload-box">
        <div className="file-input-wrapper">
            <label htmlFor="file-upload" className="custom-file-upload">
                <Upload size={24} /> <span>{file ? file.name : "Click to Upload Audio"}</span>
            </label>
            <input id="file-upload" type="file" accept="audio/*" onChange={handleFileChange} />
        </div>

        <div className="controls-row">
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="lang-select">
            <option value="en">English (No Trans)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
          <button onClick={handleTranscribe} disabled={!file || isLoading} className="btn-primary">
            {isLoading ? "Processing..." : "Start Transcription"}
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      {data && (
        <div className="results-area">
          <div className="results-header">
             <h3>Results</h3>
             <button onClick={handleDelete} className="btn-icon"><Trash2 size={18} /></button>
          </div>
          
          {audioUrl && <audio controls src={audioUrl} className="w-full mb-4" />}

          <div className="grid-2">
            <div className="text-card">
                <h4>Original Text</h4>
                <p>{data.original_text}</p>
            </div>
            <div className="text-card">
                <h4>Translation ({targetLang})</h4>
                <p>{data.translated_text}</p>
            </div>
          </div>

          <div className="timestamps-area">
            <h4>Timestamps</h4>
            <div className="tags">
                {data.word_timestamps?.map((t, i) => (
                    <span key={i} className="tag">{t.word} <small>{t.start.toFixed(1)}s</small></span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;