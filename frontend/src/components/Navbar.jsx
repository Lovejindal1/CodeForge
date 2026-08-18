import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-detect active nav item from current URL path
  const path = location.pathname;
  const activeKey =
    path.startsWith("/problems") ? "problems" :
    path.startsWith("/submissions") ? "submissions" :
    path.startsWith("/profile") ? "profile" : "";

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();           // clears token + user from context + localStorage
    navigate("/login");
  };

  const navItems = [
    { key: "problems",    label: "Problems",    path: "/problems" },
    { key: "submissions", label: "Submissions", path: "/submissions" },
    { key: "profile",     label: "Profile",     path: "/profile" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-inner">

        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate("/problems")}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6L3 12L8 18"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">CodeForge</span>
        </div>

        {/* DESKTOP CENTER LINKS */}
        <div className="nav-links">
          {navItems.map(({ key, label, path: to }) => (
            <button
              key={key}
              className={`nav-link ${activeKey === key ? "active" : ""}`}
              onClick={() => navigate(to)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* DESKTOP RIGHT — user chip + logout */}
        <div className="nav-right">
          {user && (
            <div className="nav-user-chip" onClick={() => navigate("/profile")}>
              <div className="nav-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
              <span className="nav-username">{user.name || "User"}</span>
            </div>
          )}

          <button className="nav-logout" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="logout-text">Logout</span>
          </button>

          {/* MOBILE HAMBURGER */}
          <button
            className={`nav-hamburger ${mobileOpen ? "open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="ham-bar" />
            <span className="ham-bar" />
            <span className="ham-bar" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER — slides down below navbar */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            {navItems.map(({ key, label, path: to }) => (
              <button
                key={key}
                className={`mobile-nav-link ${activeKey === key ? "active" : ""}`}
                onClick={() => { navigate(to); setMobileOpen(false); }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mobile-nav-footer">
            {user && (
              <div className="mobile-user-info" onClick={() => { navigate("/profile"); setMobileOpen(false); }}>
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
                <div className="mobile-user-details">
                  <span className="mobile-user-name">{user.name}</span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </div>
            )}
            <button className="mobile-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
