import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="not-found-page">
      {token && <Navbar />}

      <div className="not-found-container">
        {/* Glow backdrop */}
        <div className="not-found-glow" />

        <div className="not-found-card">
          <div className="not-found-code-badge">
            <span className="dot dot-red" />
            <span className="dot dot-amber" />
            <span className="dot dot-green" />
            <span className="not-found-status-tag">404 : STATUS_ROUTE_NOT_FOUND</span>
          </div>

          <div className="not-found-hero">
            <h1 className="not-found-glitch">404</h1>
            <h2 className="not-found-title">Page Not Found</h2>
            <p className="not-found-desc">
              The requested URL could not be located on the server. The route may have been
              moved, deleted, or you might have mistyped the address.
            </p>
          </div>

          <div className="not-found-snippet">
            <span className="nf-keyword">throw new</span> <span className="nf-class">RouteNotFoundException</span>(
            <span className="nf-string">"{window.location.pathname}"</span>);
          </div>

          <div className="not-found-actions">
            <button
              id="back-to-problems-btn"
              className="not-found-btn primary"
              onClick={() => navigate("/problems")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Problems
            </button>

            {token && (
              <button
                id="view-profile-btn"
                className="not-found-btn secondary"
                onClick={() => navigate("/profile")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                User Profile
              </button>
            )}

            {!token && (
              <button
                id="go-to-login-btn"
                className="not-found-btn secondary"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
