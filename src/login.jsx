import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start true to check for auto-login
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Checking session...");

  // 1. Auto Login Check on Mount
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem("user");
      
      if (savedUser) {
        setStatus("Welcome back! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // No user found, stop loading and show form
        setIsLoading(false);
      }
    };

    // Simulate a small delay for the "App Loading" feel
    setTimeout(checkSession, 800);
  }, [navigate]);

  // 2. Handle Manual Login
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setStatus("Verifying credentials...");

    // Fake API Call Simulation
    setTimeout(() => {
      // Simple validation logic
      if (email.trim() !== "" && password.trim() !== "") {
        // SUCCESS: Save user and redirect
        localStorage.setItem("user", JSON.stringify({ email, token: "fake-jwt-token" }));
        setStatus("Login Successful!");
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        // FAIL
        setError("Invalid email or password.");
        setIsLoading(false);
      }
    }, 1500);
  };

  // --- RENDER: LOADING SCREEN ---
  if (isLoading) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h1 style={{ marginBottom: '1rem', color: '#646cff' }}>Synapse</h1>
          <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Loader2 className="animate-spin" size={48} color="#646cff" />
          </div>
          <p style={{ color: '#a1a1aa' }}>{status}</p>
        </div>
      </div>
    );
  }

  // --- RENDER: LOGIN FORM ---
  return (
    <div className="login-screen">
      <div className="login-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem' }}>Welcome Back</h1>
          <p style={{ color: '#a1a1aa' }}>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Email Input */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px', // Space for icon
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>

          {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px',
              width: '100%' 
            }}
          >
            <LogIn size={18} /> Sign In
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '0.8rem' }}>
              Tip: Use any email and password to test.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;