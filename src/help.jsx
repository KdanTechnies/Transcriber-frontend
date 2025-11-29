const Help = () => {
  return (
    <div className="page-container">
        <h1>Help Center</h1>
        <div className="card">
            <h3>How to use?</h3>
            <ol style={{paddingLeft: '20px', lineHeight: '2'}}>
                <li>Go to the <strong>Dashboard</strong>.</li>
                <li>Upload an MP3 or WAV file.</li>
                <li>Select your target language.</li>
                <li>Call +234-912-8364-247</li>
                <li>Click <strong>Start Transcription</strong>.</li>
                <li>Wait process (might take 10-20 seconds).</li>
            </ol>
        </div>
    </div>
  );
};
export default Help;