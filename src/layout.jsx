import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, HelpCircle, Info, LogOut } from 'lucide-react';
import './App.css'; // Ensure your responsive CSS is imported here

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  // Helper to determine active class
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <div className="app-shell">
      {/* Sidebar (Becomes Top Navbar on Mobile) */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>🎙️ Synapse</h2>
        </div>
        
        {/* Navigation Menu */}
        <nav className="nav-menu">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <LayoutDashboard size={20} /> 
            <span>Dashboard</span>
          </Link>
          
          <Link to="/settings" className={isActive('/settings')}>
            <Settings size={20} /> 
            <span>Settings</span>
          </Link>
          
          <Link to="/help" className={isActive('/help')}>
            <HelpCircle size={20} /> 
            <span>Help</span>
          </Link>
          
          <Link to="/about" className={isActive('/about')}>
            <Info size={20} /> 
            <span>About</span>
          </Link>
        </nav>

        {/* Logout Area */}
        <div className="logout-area">
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={18} /> 
            {/* The span allows CSS to hide the text on mobile screens */}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Where Dashboard/Microphone logic will render) */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;