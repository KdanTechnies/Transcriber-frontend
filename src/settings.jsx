const Settings = () => {
  return (
    <div className="page-container">
        <h1>Settings</h1>
        <div className="card">
            <h3>Preferences</h3>
            <div className="setting-item">
                <label>Default Language</label>
                <select className="lang-select"><option>English</option></select>
            </div>
            <div className="setting-item">
                <label>Dark Mode</label>
                <input type="checkbox" checked readOnly />
            </div>
            <div className="setting-item">
                <label>Auto-Delete Audio after 24h</label>
                <input type="checkbox" />
            </div>
        </div>
    </div>
  );
};
export default Settings;