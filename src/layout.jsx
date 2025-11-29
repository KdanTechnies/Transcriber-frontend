import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, HelpCircle, Info, LogOut } from 'lucide-react';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>🎙️ Synapse Transcribe App</h2>
        </div>
        
        <nav className="nav-menu">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/settings" className={isActive('/settings')}>
            <Settings size={20} /> Settings
          </Link>
          <Link to="/help" className={isActive('/help')}>
            <HelpCircle size={20} /> Help
          </Link>
          <Link to="/about" className={isActive('/about')}>
            <Info size={20} /> About
          </Link>
        </nav>

        <div className="logout-area">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;