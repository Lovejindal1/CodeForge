import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Submissions.css";
import { getMySubmissions, getMyStats } from "../services/submissionService";
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

const STATUS_FILTERS = ["all", "accepted", "wrong_answer", "runtime_error", "compile_error", "time_limit_exceeded"];

function Submissions() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getMyStats();
        setStats(res.data);
      } catch {}
    };
    fetchStats();
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await getMySubmissions(params);
      setSubmissions(res.data.submissions);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="subs-page">
      <Navbar active="submissions" />

      <div className="subs-container">
        {/* PAGE TITLE */}
        <div className="subs-page-header">
          <h1 className="subs-page-title">Submissions</h1>
          <p className="subs-page-sub">Your complete submission history</p>
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="subs-stats-row">
            <div className="sstat-card">
              <div className="sstat-icon total">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="sstat-info">
                <span className="sstat-val">{stats.totalSubmissions}</span>
                <span className="sstat-lbl">Total Submissions</span>
              </div>
            </div>

            <div className="sstat-card">
              <div className="sstat-icon solved">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="sstat-info">
                <span className="sstat-val green">{stats.solvedProblems}</span>
                <span className="sstat-lbl">Problems Solved</span>
              </div>
            </div>

            <div className="sstat-card">
              <div className="sstat-icon rate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <div className="sstat-info">
                <span className="sstat-val orange">{stats.acceptanceRate}%</span>
                <span className="sstat-lbl">Acceptance Rate</span>
              </div>
            </div>

            <div className="sstat-card">
              <div className="sstat-icon failed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="sstat-info">
                <span className="sstat-val red">{stats.wrongAnswer}</span>
                <span className="sstat-lbl">Wrong Answers</span>
              </div>
            </div>
          </div>
        )}

        {/* STATUS FILTER TABS */}
        <div className="subs-filter-row">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`subs-filter-tab ${s} ${statusFilter === s ? "active" : ""}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="subs-table-wrap">
          <table className="subs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Status</th>
                <th>Tests</th>
                <th>Runtime</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="subs-sk-row">
                  <td><div className="skeleton" style={{ width: 20, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: "60%", height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 90, height: 20, borderRadius: 999 }} /></td>
                  <td><div className="skeleton" style={{ width: 50, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 50, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 100, height: 13 }} /></td>
                </tr>
              ))}

              {!loading && error && (
                <tr><td colSpan={6} className="subs-td-msg">
                  <span style={{ color: "var(--red)" }}>⚠ {error}</span>
                </td></tr>
              )}

              {!loading && !error && submissions.length === 0 && (
                <tr><td colSpan={6} className="subs-td-msg">
                  <div className="subs-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>No submissions yet</p>
                    <span>Solve a problem to see your history here!</span>
                    <button className="subs-go-btn" onClick={() => navigate("/problems")}>
                      Browse Problems →
                    </button>
                  </div>
                </td></tr>
              )}

              {!loading && !error && submissions.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={`subs-row ${idx % 2 === 0 ? "" : "alt"}`}
                  onClick={() => navigate(`/problems/${sub.problem._id}`)}
                >
                  <td className="sub-num">
                    {(pagination.page - 1) * 15 + idx + 1}
                  </td>
                  <td className="sub-title">
                    <div className="sub-title-inner">
                      <span className="sub-problem-num">#{sub.problem.problemNumber}</span>
                      <span className="sub-problem-title">{sub.problem.title}</span>
                      <span className={`diff-badge ${sub.problem.difficulty}`}>
                        {sub.problem.difficulty.charAt(0).toUpperCase() + sub.problem.difficulty.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`sub-status-badge ${sub.status}`}>
                      {sub.status === "accepted" ? "✓" : "✗"} {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className="sub-tests">
                    {sub.passedTests}/{sub.totalTests}
                  </td>
                  <td className="sub-runtime">
                    {sub.runtime != null ? `${sub.runtime}ms` : "—"}
                  </td>
                  <td className="sub-date">{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && !error && submissions.length > 0 && pagination.totalPages > 1 && (
          <div className="subs-pagination">
            <button
              className="pag-btn"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹ Prev
            </button>
            <span className="pag-info">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              className="pag-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;
