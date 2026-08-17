import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getUserDashboard, updateProfile, changePassword } from "../services/userService";
import Navbar from "../components/Navbar";

const STATUS_LABELS = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  compile_error: "Compile Error",
  time_limit_exceeded: "Time Limit Exceeded",
  pending: "Pending",
  running: "Running",
};

function Profile() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getUserDashboard();
      const data = res.data;
      setDashboard(data);
      if (data.user?.name) {
        setName(data.user.name);
      }
    } catch (err) {
      setLoadError(err.response?.data?.message || "Failed to load profile dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setNameSaving(true);
    setNameSuccess("");
    setNameError("");
    try {
      const res = await updateProfile({ name });
      if (dashboard) {
        setDashboard({
          ...dashboard,
          user: { ...dashboard.user, name: res.data.name },
        });
      }
      setNameSuccess("Name updated successfully!");
    } catch (err) {
      setNameError(err.response?.data?.message || "Failed to update name.");
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setPasswordSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "Recently";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShort = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar active="profile" />
        <div className="profile-loading">
          <div className="spinner" />
          <p>Loading profile dashboard...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="profile-page">
        <Navbar active="profile" />
        <div className="profile-error">
          <p style={{ color: "var(--red)" }}>{loadError}</p>
          <button className="settings-btn" onClick={fetchDashboard} style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    totalSubmissions = 0,
    acceptedSubmissions = 0,
    wrongSubmissions = 0,
    solvedProblems = 0,
    totalProblems = 0,
    acceptanceRate = 0,
    easySolved = 0,
    mediumSolved = 0,
    hardSolved = 0,
    easyTotal = 0,
    mediumTotal = 0,
    hardTotal = 0,
    recentSubmissions = [],
    user = {},
  } = dashboard || {};

  const totalSolvedPct = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
  const easyPct = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;
  const mediumPct = mediumTotal > 0 ? Math.round((mediumSolved / mediumTotal) * 100) : 0;
  const hardPct = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;

  return (
    <div className="profile-page">
      <Navbar active="profile" />

      <div className="profile-container">
        {/* ── HERO SECTION ── */}
        <div className="prof-hero">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {user.role === "admin" && <span className="admin-pill">Admin</span>}
          </div>
          <div className="prof-info">
            <div className="prof-name-row">
              <h1 className="prof-name">{user.name || "User"}</h1>
              <span className="prof-badge">{solvedProblems} Solved</span>
            </div>
            <p className="prof-email">{user.email}</p>
            <p className="prof-since">Member since {formatDate(user.createdAt)}</p>
          </div>
          <button
            id="browse-problems-btn"
            className="prof-action-btn"
            onClick={() => navigate("/problems")}
          >
            Solve Problems →
          </button>
        </div>

        {/* ── MAIN DASHBOARD STATS ── */}
        <div className="prof-stats-grid">
          {/* Card 1: Solved Problems */}
          <div className="prof-stat-card primary">
            <div className="stat-card-header">
              <span className="stat-title">Problems Solved</span>
              <span className="stat-pill green">{totalSolvedPct}% completed</span>
            </div>
            <div className="stat-main-num">
              <span className="stat-val green">{solvedProblems}</span>
              <span className="stat-denom">/ {totalProblems}</span>
            </div>
            <div className="stat-progress-track">
              <div
                className="stat-progress-fill"
                style={{ width: `${Math.min(100, totalSolvedPct)}%` }}
              />
            </div>
            <div className="stat-footer-text">
              {totalProblems - solvedProblems > 0
                ? `${totalProblems - solvedProblems} problems remaining`
                : "All problems completed! 🎉"}
            </div>
          </div>

          {/* Card 2: Acceptance Rate */}
          <div className="prof-stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Acceptance Rate</span>
              <span className="stat-pill orange">{acceptanceRate}%</span>
            </div>
            <div className="stat-main-num">
              <span className="stat-val orange">{acceptanceRate}%</span>
            </div>
            <div className="stat-progress-track">
              <div
                className="stat-progress-fill orange"
                style={{ width: `${Math.min(100, acceptanceRate)}%` }}
              />
            </div>
            <div className="stat-footer-breakdown">
              <span className="breakdown-item green">✓ {acceptedSubmissions} Accepted</span>
              <span className="breakdown-dot">·</span>
              <span className="breakdown-item red">✗ {wrongSubmissions} Wrong</span>
            </div>
          </div>

          {/* Card 3: Total Submissions */}
          <div className="prof-stat-card">
            <div className="stat-card-header">
              <span className="stat-title">Total Submissions</span>
              <span className="stat-pill blue">{totalSubmissions} runs</span>
            </div>
            <div className="stat-main-num">
              <span className="stat-val blue">{totalSubmissions}</span>
            </div>
            <div className="stat-subs-breakdown">
              <div className="sub-mini-stat">
                <span className="sub-mini-lbl">Accepted</span>
                <span className="sub-mini-val green">{acceptedSubmissions}</span>
              </div>
              <div className="sub-mini-stat">
                <span className="sub-mini-lbl">Failed</span>
                <span className="sub-mini-val red">{wrongSubmissions}</span>
              </div>
            </div>
            <div className="stat-footer-text">Across all solved and attempted challenges</div>
          </div>
        </div>

        {/* ── DIFFICULTY BREAKDOWN ── */}
        <div className="prof-section">
          <div className="prof-section-header">
            <div>
              <h2 className="prof-section-title">Difficulty Breakdown</h2>
              <p className="prof-section-subtitle">Track your progress across difficulty levels</p>
            </div>
          </div>

          <div className="difficulty-cards-grid">
            {/* Easy */}
            <div className="diff-card easy">
              <div className="diff-card-top">
                <div className="diff-card-tag easy">Easy</div>
                <span className="diff-card-pct">{easyPct}%</span>
              </div>
              <div className="diff-card-count">
                <span className="diff-solved green">{easySolved}</span>
                <span className="diff-total">/ {easyTotal} Solved</span>
              </div>
              <div className="diff-progress-track">
                <div className="diff-progress-fill easy" style={{ width: `${easyPct}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div className="diff-card medium">
              <div className="diff-card-top">
                <div className="diff-card-tag medium">Medium</div>
                <span className="diff-card-pct">{mediumPct}%</span>
              </div>
              <div className="diff-card-count">
                <span className="diff-solved amber">{mediumSolved}</span>
                <span className="diff-total">/ {mediumTotal} Solved</span>
              </div>
              <div className="diff-progress-track">
                <div className="diff-progress-fill medium" style={{ width: `${mediumPct}%` }} />
              </div>
            </div>

            {/* Hard */}
            <div className="diff-card hard">
              <div className="diff-card-top">
                <div className="diff-card-tag hard">Hard</div>
                <span className="diff-card-pct">{hardPct}%</span>
              </div>
              <div className="diff-card-count">
                <span className="diff-solved red">{hardSolved}</span>
                <span className="diff-total">/ {hardTotal} Solved</span>
              </div>
              <div className="diff-progress-track">
                <div className="diff-progress-fill hard" style={{ width: `${hardPct}%` }} />
              </div>
            </div>
          </div>

          {/* Solved Ratio Segmented Bar */}
          {solvedProblems > 0 && (
            <div className="segmented-bar-container">
              <div className="segmented-bar-header">
                <span>Solved Distribution</span>
                <span>{solvedProblems} Total Solved</span>
              </div>
              <div className="segmented-bar">
                {easySolved > 0 && (
                  <div
                    className="segment easy"
                    style={{ width: `${(easySolved / solvedProblems) * 100}%` }}
                    title={`Easy: ${easySolved}`}
                  />
                )}
                {mediumSolved > 0 && (
                  <div
                    className="segment medium"
                    style={{ width: `${(mediumSolved / solvedProblems) * 100}%` }}
                    title={`Medium: ${mediumSolved}`}
                  />
                )}
                {hardSolved > 0 && (
                  <div
                    className="segment hard"
                    style={{ width: `${(hardSolved / solvedProblems) * 100}%` }}
                    title={`Hard: ${hardSolved}`}
                  />
                )}
              </div>
              <div className="segmented-legend">
                <span className="legend-item"><span className="legend-dot easy" /> Easy ({easySolved})</span>
                <span className="legend-item"><span className="legend-dot medium" /> Medium ({mediumSolved})</span>
                <span className="legend-item"><span className="legend-dot hard" /> Hard ({hardSolved})</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <div className="prof-section">
          <div className="prof-section-header">
            <h2 className="prof-section-title">Recent Activity</h2>
            <button className="prof-text-link" onClick={() => navigate("/submissions")}>
              View All Submissions →
            </button>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="prof-empty-activity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No recent submissions yet.</p>
              <button className="settings-btn" onClick={() => navigate("/problems")}>
                Start Coding
              </button>
            </div>
          ) : (
            <div className="recent-list">
              {recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="recent-row"
                  onClick={() => navigate(`/problems/${sub.problem?._id || sub.problem}`)}
                >
                  <div className="recent-title-group">
                    <span className="recent-title">
                      {sub.problem?.problemNumber ? `${sub.problem.problemNumber}. ` : ""}
                      {sub.problem?.title || "Problem"}
                    </span>
                    {sub.problem?.difficulty && (
                      <span className={`diff-badge ${sub.problem.difficulty}`}>
                        {sub.problem.difficulty}
                      </span>
                    )}
                  </div>
                  <span className="recent-runtime">
                    {sub.runtime != null ? `${sub.runtime}ms` : ""}
                  </span>
                  <span className="recent-date">{formatShort(sub.createdAt)}</span>
                  <span className={`recent-status ${sub.status}`}>
                    {STATUS_LABELS[sub.status] ?? sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ACCOUNT SETTINGS ── */}
        <div className="prof-settings-grid">
          {/* Edit Name */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3 className="settings-card-title">Edit Display Name</h3>
              <p className="settings-card-sub">Update how your name appears on CodeForge</p>
            </div>
            <form className="settings-form" onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              <button type="submit" className="settings-btn" disabled={nameSaving}>
                {nameSaving ? "Saving..." : "Save Name"}
              </button>
              {nameSuccess && <p className="settings-msg success">{nameSuccess}</p>}
              {nameError && <p className="settings-msg error">{nameError}</p>}
            </form>
          </div>

          {/* Change Password */}
          <div className="settings-card">
            <div className="settings-card-header">
              <h3 className="settings-card-title">Change Password</h3>
              <p className="settings-card-sub">Use a strong password (min. 8 characters)</p>
            </div>
            <form className="settings-form" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current password"
                required
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button type="submit" className="settings-btn" disabled={passwordSaving}>
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
              {passwordSuccess && <p className="settings-msg success">{passwordSuccess}</p>}
              {passwordError && <p className="settings-msg error">{passwordError}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
