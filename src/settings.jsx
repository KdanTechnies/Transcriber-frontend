import { useState } from 'react';
import { Save, Trash2, FileText, Mic, Globe, HardDrive, Bell } from 'lucide-react';

const Settings = () => {
  // State to manage settings (UI only for now)
  const [settings, setSettings] = useState({
    language: "en",
    model: "vosk-small",
    theme: "dark",
    autoDelete: false,
    showTimestamps: true,
    exportFormat: "txt",
    notifications: true,
    profanityFilter: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // In a real app, you would save this to localStorage or the Backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Configure your transcription preferences.</p>
      </header>

      {/* SECTION 1: TRANSCRIPTION ENGINE */}
      <div className="card">
        <div className="card-header">
            <Mic size={20} color="#646cff" /> <h3>Transcription Engine</h3>
        </div>
        
        <div className="setting-item">
            <label>Default Language</label>
            <select 
                name="language" 
                value={settings.language} 
                onChange={handleChange} 
                className="lang-select"
            >
                <option value="en">English (US)</option>
                <option value="en-uk">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
            </select>
        </div>

        <div className="setting-item">
            <label>AI Model Accuracy</label>
            <select 
                name="model" 
                value={settings.model} 
                onChange={handleChange} 
                className="lang-select"
            >
                <option value="vosk-small">Standard (Fastest)</option>
                <option value="vosk-large">High Accuracy (Slower)</option>
            </select>
        </div>

        <div className="setting-item">
            <label>Profanity Filter</label>
            <div className="toggle-wrapper">
                <input 
                    type="checkbox" 
                    name="profanityFilter"
                    checked={settings.profanityFilter}
                    onChange={handleChange}
                />
            </div>
        </div>
      </div>

      {/* SECTION 2: EXPORT & DISPLAY */}
      <div className="card">
        <div className="card-header">
            <FileText size={20} color="#646cff" /> <h3>Export & Display</h3>
        </div>

        <div className="setting-item">
            <label>Default Export Format</label>
            <select 
                name="exportFormat" 
                value={settings.exportFormat} 
                onChange={handleChange} 
                className="lang-select"
            >
                <option value="txt">Text File (.txt)</option>
                <option value="json">JSON Data (.json)</option>
                <option value="srt">Subtitles (.srt)</option>
            </select>
        </div>

        <div className="setting-item">
            <label>Show Timestamps inline</label>
            <input 
                type="checkbox" 
                name="showTimestamps"
                checked={settings.showTimestamps}
                onChange={handleChange}
            />
        </div>
      </div>

      {/* SECTION 3: SYSTEM & STORAGE */}
      <div className="card">
        <div className="card-header">
            <HardDrive size={20} color="#646cff" /> <h3>System & Storage</h3>
        </div>

        <div className="setting-item">
            <label>Dark Mode</label>
            {/* Hardcoded to checked because your CSS is dark mode only right now */}
            <input type="checkbox" checked disabled title="This app is Dark Mode only" />
        </div>

        <div className="setting-item">
            <label>Enable Browser Notifications</label>
            <input 
                type="checkbox" 
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
            />
        </div>

        <div className="setting-item">
            <label>Auto-Delete Audio after 24h</label>
            <input 
                type="checkbox" 
                name="autoDelete"
                checked={settings.autoDelete}
                onChange={handleChange}
            />
        </div>
        
        <div className="setting-item" style={{borderBottom: 'none', paddingTop: '1rem'}}>
            <button className="btn-danger" style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'}}>
                <Trash2 size={16} /> Clear Local Cache
            </button>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Save size={18} /> Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;