import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/problems"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── BRAND LEFT ── */}
      <div className="brand-section">
        <div className="brand-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6L3 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">CodeForge</span>
        </div>

        <div className="brand-content">
          <p className="brand-eyebrow">Welcome Back, Developer</p>
          <h1 className="brand-headline">
            Code.<br />
            Solve.<br />
            <span>Conquer.</span>
          </h1>
          <p className="brand-desc">
            Continue your journey, tackle new problems, and sharpen your
            algorithmic thinking on CodeForge.
          </p>

          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span /><span /><span />
              </div>
              <span className="terminal-name">codeforge — bash</span>
            </div>
            <div className="terminal-body">
              <p><span className="t-prompt">$</span><span className="t-cmd"> codeforge login</span></p>
              <p><span className="t-info">›</span><span className="t-cmd"> authenticating developer...</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> identity verified</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> loading workspace</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> ready to code</span></p>
            </div>
          </div>
        </div>

        {/* Floating decorations */}
        <div className="float-sym s1">{"{ }"}</div>
        <div className="float-sym s2">{"[ ]"}</div>
        <div className="float-sym s3">{"< >"}</div>
      </div>

      {/* ── FORM RIGHT ── */}
      <div className="form-section">
        <div className="login-card">
          {/* Mobile logo */}
          <div className="mobile-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8 6L3 12L8 18" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 6L21 12L16 18" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 4L11 20" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span>CodeForge</span>
          </div>

          <p className="form-eyebrow">Welcome back</p>
          <h2 className="form-title">Sign In</h2>
          <p className="form-subtitle">Login to continue your coding journey.</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="login-password">Password</label>
                <button type="button" className="forgot-link"></button>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="remember-row">
              <input type="checkbox" id="remember" />
              <span>Remember me for 30 days</span>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
          </form>

          <div className="divider">
            <span /><p>OR</p><span />
          </div>

          <p className="register-text">
            Don't have an account?
            <span onClick={() => navigate("/register")}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
