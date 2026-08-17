import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getCurrentUser, updateProfile, changePassword } from "../services/userService";
import { getMyStats } from "../services/submissionService";
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

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [userRes, statsRes] = await Promise.all([
          getCurrentUser(),
          getMyStats(),
        ]);
        setUser(userRes.data);
        setName(userRes.data.name);
        setStats(statsRes.data);
      } catch (err) {
        setLoadError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setNameSaving(true);
    setNameSuccess("");
    setNameError("");
    try {
      const res = await updateProfile({ name });
      setUser(res.data);
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

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const formatShort = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar active="profile" />
        <div className="profile-loading">
          <div className="spinner" />
          <p>Loading profile...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar active="profile" />

      <div className="profile-container">
        {/* ── HERO ── */}
        <div className="prof-hero">
          <div className="prof-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="prof-info">
            <p className="prof-name">{user.name}</p>
            <p className="prof-email">{user.email}</p>
            <p className="prof-since">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        {/* ── STATS ── */}
        {stats && (
          <div className="prof-stats-grid">
            <div className="prof-stat">
              <span className="prof-stat-val">{stats.totalSubmissions}</span>
              <span className="prof-stat-lbl">Total Submissions</span>
            </div>
            <div className="prof-stat">
              <span className="prof-stat-val green">{stats.solvedProblems}</span>
              <span className="prof-stat-lbl">Problems Solved</span>
            </div>
            <div className="prof-stat">
              <span className="prof-stat-val orange">{stats.acceptanceRate}%</span>
              <span className="prof-stat-lbl">Acceptance Rate</span>
            </div>
          </div>
        )}

        {/* ── RECENT ACTIVITY ── */}
        {stats?.recentSubmissions?.length > 0 && (
          <div className="prof-section">
            <div className="prof-section-header">
              <span className="prof-section-title">Recent Activity</span>
            </div>
            <div className="recent-list">
              {stats.recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="recent-row"
                  onClick={() => navigate(`/problems/${sub.problem._id}`)}
                >
                  <span className="recent-title">{sub.problem.title}</span>
                  <span className="recent-date">{formatShort(sub.createdAt)}</span>
                  <span className={`recent-status ${sub.status}`}>
                    {STATUS_LABELS[sub.status] ?? sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        <div className="prof-settings-grid">
          {/* Edit Name */}
          <div className="settings-card">
            <div className="settings-card-header">
              <p className="settings-card-title">Edit Display Name</p>
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
              {nameError   && <p className="settings-msg error">{nameError}</p>}
            </form>
          </div>

          {/* Change Password */}
          <div className="settings-card">
            <div className="settings-card-header">
              <p className="settings-card-title">Change Password</p>
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
              {passwordError   && <p className="settings-msg error">{passwordError}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
