import { BookOpen, Phone, AlertCircle, FileAudio, CheckCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="page-container">
        <header className="page-header">
            <h1>Help Center</h1>
            <p>Guides, troubleshooting, and support.</p>
        </header>

        {/* SECTION 1: QUICK START GUIDE */}
        <div className="card">
            <div className="card-header">
                <BookOpen size={20} color="#646cff" /> 
                <h3>How to use the Transcriber</h3>
            </div>
            <div style={{ paddingLeft: '10px' }}>
                <ol className="help-steps">
                    <li>
                        <strong>Prepare your file:</strong> Ensure you have an audio file in <code>.mp3</code>, <code>.wav</code>, or <code>.m4a</code> format.
                    </li>
                    <li>
                        <strong>Upload:</strong> Go to the <a href="/dashboard" style={{color: '#646cff'}}>Dashboard</a> and click the upload box to select your file.
                    </li>
                    <li>
                        <strong>Select Language:</strong> Choose the language you want the text translated into (or keep it as English).
                    </li>
                    <li>
                        <strong>Start Process:</strong> Click the <strong>Start Transcription</strong> button.
                    </li>
                    <li>
                        <strong>Wait:</strong> The AI is processing locally. This usually takes <strong>10-30 seconds</strong> depending on file length.
                    </li>
                    <li>
                        <strong>Result:</strong> View the text, translation, and timestamps. You can play the audio to follow along.
                    </li>
                </ol>
            </div>
        </div>

        {/* SECTION 2: FAQ & TROUBLESHOOTING */}
        <div className="card">
            <div className="card-header">
                <AlertCircle size={20} color="#646cff" /> 
                <h3>Frequently Asked Questions</h3>
            </div>
            
            <div className="faq-item">
                <h4>🛑 Supported File Types?</h4>
                <p>We currently support MP3, WAV, M4A, and OGG files. Video files (MP4) must be converted to audio first.</p>
            </div>

            <div className="faq-item">
                <h4>⏳ Why is it taking long?</h4>
                <p>The transcription happens <strong>offline</strong> on your computer's CPU. Longer audio files or older computers may take more time to process.</p>
            </div>

            <div className="faq-item">
                <h4>💾 Is my data safe?</h4>
                <p>Yes! Your audio files are processed locally on your server and are <strong>never</strong> uploaded to the cloud.</p>
            </div>
        </div>

        {/* SECTION 3: CONTACT SUPPORT */}
        <div className="card">
            <div className="card-header">
                <Phone size={20} color="#646cff" /> 
                <h3>Contact Support</h3>
            </div>
            <p>If you are experiencing issues or need a custom feature, please contact our technical team.</p>
            
            <div className="contact-box">
                <div className="contact-row">
                    <span className="label">Technical Hotline:</span>
                    <a href="tel:+2349128364247" className="contact-link">+234-912-8364-247</a>
                </div>
                <div className="contact-row">
                    <span className="label">Email Support:</span>
                    <a href="mailto:support@transcriber.com" className="contact-link">support@transcriber.com</a>
                </div>
                <div className="contact-row">
                    <span className="label">Office Hours:</span>
                    <span>Mon - Fri, 9:00 AM - 5:00 PM (WAT)</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Help;