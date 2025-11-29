const About = () => {
  return (
    <div className="page-container">
        <h1>About</h1>
        <div className="card">
            <h3>Synapse Transcriber Application</h3>
            <p>Built with FastAPI, Vosk (Offline), and React.</p>
            <p>This application processes audio locally on your server without sending data to the cloud.</p>
            <br />
            <p className="text-muted">© 2025 Synapse Dev & Design</p>
        </div>
    </div>
  );
};
export default About;