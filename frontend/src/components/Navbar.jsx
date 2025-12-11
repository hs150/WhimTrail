import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./navbar.css";


export default function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Sticky navbar function
  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <nav className={`navbar ${sticky ? "sticky" : ""}`}>
      <div className="logo">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          🌍 WhimTrail
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/destinations" onClick={() => setMenuOpen(false)}>Destinations</Link>
        <Link to="/itinerary" onClick={() => setMenuOpen(false)}>Itinerary</Link>
        <Link to="/chat" onClick={() => setMenuOpen(false)}>Chat Support</Link>
      </div>

      {/* Auth/Profile Section */}
      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <img
                src={user?.avatar || "https://via.placeholder.com/40?text=User"}
                alt={user?.firstName}
              />
              <span className="username">{user?.firstName}</span>
            </button>

            {profileOpen && (
              <div className="dropdown-menu">
                <Link to="/settings" onClick={() => setProfileOpen(false)}>
                  <FaCog /> Settings
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-signin">LogIn</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
