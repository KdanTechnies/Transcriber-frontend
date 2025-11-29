import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    // Simulate an automatic login check
    setTimeout(() => {
      setStatus("Logging in as Guest...");
      localStorage.setItem("user", "GuestUser");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    }, 1500);
  }, [navigate]);

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <div className="loading-spinner">
          <Loader2 className="animate-spin" size={48} color="#646cff" />
        </div>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default Login;