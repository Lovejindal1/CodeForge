import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ active }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/problems")}>
        <div className="logo-symbol">&lt;/&gt;</div>
        <span>CodeForge</span>
      </div>

      <div className="nav-links">
        <span
          className={`nav-link ${active === "problems" ? "active" : ""}`}
          onClick={() => navigate("/problems")}
        >
          Problems
        </span>
        <span
          className={`nav-link ${active === "submissions" ? "active" : ""}`}
          onClick={() => navigate("/submissions")}
        >
          Submissions
        </span>
        <span
          className={`nav-link ${active === "profile" ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          Profile
        </span>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
