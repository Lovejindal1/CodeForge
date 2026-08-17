import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      setSuccess("Account created! Redirecting to login...");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];

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
          <p className="brand-eyebrow">Join the community</p>
          <h1 className="brand-headline">
            Build.<br />
            Solve.<br />
            <span>Compete.</span>
          </h1>
          <p className="brand-desc">
            Join thousands of developers practicing algorithms and data
            structures. Start your journey today.
          </p>

          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots"><span /><span /><span /></div>
              <span className="terminal-name">codeforge — bash</span>
            </div>
            <div className="terminal-body">
              <p><span className="t-prompt">$</span><span className="t-cmd"> ./solution.cpp</span></p>
              <p><span className="t-info">›</span><span className="t-cmd"> compiling...</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> Test 1 passed</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> Test 2 passed</span></p>
              <p><span className="t-ok">✓</span><span className="t-cmd"> All tests passed — Accepted!</span></p>
            </div>
          </div>
        </div>

        <div className="float-sym s1">{"{ }"}</div>
        <div className="float-sym s2">{"[ ]"}</div>
        <div className="float-sym s3">{"< >"}</div>
      </div>

      {/* ── FORM RIGHT ── */}
      <div className="form-section">
        <div className="login-card">
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

          <p className="form-eyebrow">Get started for free</p>
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">Join CodeForge and start solving problems.</p>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Password strength hints */}
            {password.length > 0 && (
              <div className="pw-checks">
                {checks.map((c) => (
                  <span key={c.label} className={`pw-check ${c.ok ? "ok" : ""}`}>
                    {c.ok ? "✓" : "○"} {c.label}
                  </span>
                ))}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading} style={{ marginTop: 20 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
          </form>

          <div className="divider">
            <span /><p>OR</p><span />
          </div>

          <p className="register-text">
            Already have an account?
            <span onClick={() => navigate("/login")}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;