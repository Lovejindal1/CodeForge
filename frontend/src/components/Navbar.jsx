import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { key: "problems", label: "Problems", path: "/problems" },
    { key: "submissions", label: "Submissions", path: "/submissions" },
    { key: "profile", label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate("/problems")}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6L3 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">CodeForge</span>
        </div>

        {/* CENTER LINKS */}
        <div className="nav-links">
          {navItems.map(({ key, label, path }) => (
            <button
              key={key}
              className={`nav-link ${active === key ? "active" : ""}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button className="nav-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
