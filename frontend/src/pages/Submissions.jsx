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
      } catch {
        // stats are a nice-to-have; don't block the page on failure
      }
    };

    fetchStats();
  }, []);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page, limit: 10 };
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await getMySubmissions(params);

      setSubmissions(res.data.submissions);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load submissions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="submissions-page">

      <Navbar active="submissions" />

      <div className="submissions-container">

        <div className="submissions-header">
          <p className="small-text">YOUR PROGRESS</p>
          <h1>Submissions</h1>
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
            <div className="stat-card">
              <span className="stat-value failed-text">{stats.wrongAnswer}</span>
              <span className="stat-label">Wrong Answers</span>
            </div>
          </div>
        )}

        {/* STATUS FILTER */}
        <div className="status-filters">
          {["all", "accepted", "wrong_answer", "runtime_error", "compile_error", "time_limit_exceeded"].map((status) => (
            <button
              key={status}
              className={`filter-chip ${statusFilter === status ? "active" : ""}`}
              onClick={() => handleFilterClick(status)}
            >
              {status === "all" ? "All" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading && <p className="status-text">Loading submissions...</p>}

        {error && <p className="status-text error-text">{error}</p>}

        {!loading && !error && submissions.length === 0 && (
          <p className="status-text">
            No submissions yet. Go solve a problem!
          </p>
        )}

        {!loading && !error && submissions.length > 0 && (
          <div className="submission-list">
            {submissions.map((sub) => (
              <div
                key={sub._id}
                className="submission-card"
                onClick={() => navigate(`/problems/${sub.problem._id}`)}
              >
                <div className="submission-main">
                  <span className="submission-problem-number">
                    #{sub.problem.problemNumber}
                  </span>
                  <span className="submission-title">{sub.problem.title}</span>
                  <span className={`difficulty-badge ${sub.problem.difficulty}`}>
                    {sub.problem.difficulty}
                  </span>
                </div>

                <div className="submission-meta">
                  <span className="submission-date">{formatDate(sub.createdAt)}</span>
                  <span className="submission-tests">
                    {sub.passedTests}/{sub.totalTests} passed
                  </span>
                  <span className={`submission-status ${sub.status}`}>
                    {STATUS_LABELS[sub.status] || sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && submissions.length > 0 && (
          <div className="pagination">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <span className="page-indicator">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Submissions;
