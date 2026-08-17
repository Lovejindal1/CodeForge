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
        setLoadError(
          err.response?.data?.message ||
          "Failed to load profile. Please try again."
        );
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
      setNameError(
        err.response?.data?.message || "Failed to update name. Please try again."
      );
    } finally {
      setNameSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
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
      setPasswordError(
        err.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar active="profile" />
        <p className="status-text">Loading profile...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="profile-page">
        <Navbar active="profile" />
        <p className="status-text error-text">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <Navbar active="profile" />

      <div className="profile-container">

        <div className="profile-header">
          <p className="small-text">YOUR ACCOUNT</p>
          <h1>Profile</h1>
        </div>

        {/* ACCOUNT OVERVIEW */}
        <div className="account-card">
          <div className="avatar-circle">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="account-info">
            <p className="account-name">{user.name}</p>
            <p className="account-email">{user.email}</p>
            <p className="account-since">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.totalSubmissions}</span>
              <span className="stat-label">Total Submissions</span>
            </div>
            <div className="stat-card">
              <span className="stat-value accepted-text">{stats.solvedProblems}</span>
              <span className="stat-label">Problems Solved</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.acceptanceRate}%</span>
              <span className="stat-label">Acceptance Rate</span>
            </div>
          </div>
        )}

        {/* RECENT SUBMISSIONS */}
        {stats?.recentSubmissions?.length > 0 && (
          <div className="section-block">
            <p className="section-title">Recent Activity</p>

            <div className="recent-list">
              {stats.recentSubmissions.map((sub) => (
                <div
                  key={sub._id}
                  className="recent-row"
                  onClick={() => navigate(`/problems/${sub.problem._id}`)}
                >
                  <span className="recent-title">{sub.problem.title}</span>
                  <span className="recent-date">{formatShortDate(sub.createdAt)}</span>
                  <span className={`recent-status ${sub.status}`}>
                    {STATUS_LABELS[sub.status] || sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT NAME */}
        <div className="section-block">
          <p className="section-title">Edit Name</p>

          <form className="settings-form" onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />

            <button type="submit" disabled={nameSaving}>
              {nameSaving ? "Saving..." : "Save"}
            </button>
          </form>

          {nameSuccess && <p className="form-success">{nameSuccess}</p>}
          {nameError && <p className="form-error">{nameError}</p>}
        </div>

        {/* CHANGE PASSWORD */}
        <div className="section-block">
          <p className="section-title">Change Password</p>

          <form className="settings-form column" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <button type="submit" disabled={passwordSaving}>
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>

          {passwordSuccess && <p className="form-success">{passwordSuccess}</p>}
          {passwordError && <p className="form-error">{passwordError}</p>}
        </div>

      </div>
    </div>
  );
}

export default Profile;
