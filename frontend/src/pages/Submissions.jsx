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

const STATUS_FILTERS = [
  { key: "all",                  label: "All" },
  { key: "accepted",             label: "Accepted" },
  { key: "wrong_answer",         label: "Wrong Answer" },
  { key: "compile_error",        label: "Compile Error" },
  { key: "runtime_error",        label: "Runtime Error" },
  { key: "time_limit_exceeded",  label: "TLE" },
];

function Submissions() {
  const navigate = useNavigate();

  const [stats,       setStats]       = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [pagination,  setPagination]  = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [page,        setPage]        = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  // ── Modal state ──
  const [selectedSub, setSelectedSub] = useState(null);
  const [copied,      setCopied]      = useState(false);

  // Fetch stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getMyStats();
        setStats(res.data);
      } catch {}
    };
    fetchStats();
  }, []);

  // Fetch paginated / filtered submissions
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await getMySubmissions(params);
      setSubmissions(res.data.submissions || []);
      setPagination(res.data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Client-side search filter by problem title / number
  const filteredSubs = submissions.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.problem?.title?.toLowerCase().includes(q) ||
      String(sub.problem?.problemNumber || "").includes(q)
    );
  });

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="subs-page">
      <Navbar />

      <div className="subs-container">

        {/* ── PAGE TITLE ── */}
        <div className="subs-page-header">
          <div>
            <h1 className="subs-page-title">Submissions</h1>
            <p className="subs-page-sub">Your complete history across all attempted problems</p>
          </div>
        </div>

        {/* ── STATS CARDS ── */}
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
                <span className="sstat-val red">{stats.wrongAnswer ?? 0}</span>
                <span className="sstat-lbl">Wrong Answers</span>
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH + FILTER BAR ── */}
        <div className="subs-controls-bar">
          {/* Search box */}
          <div className="subs-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by problem title or #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="subs-clear-search" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="subs-filter-row">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.key}
                className={`subs-filter-tab ${statusFilter === s.key ? "active" : ""}`}
                onClick={() => { setStatusFilter(s.key); setPage(1); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="subs-table-wrap">
          <table className="subs-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Status</th>
                <th>Tests</th>
                <th>Runtime</th>
                <th>Language</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Skeleton rows while loading */}
              {loading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="subs-sk-row">
                  <td><div className="skeleton" style={{ width: 20, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: "60%", height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 90, height: 20, borderRadius: 999 }} /></td>
                  <td><div className="skeleton" style={{ width: 50, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 50, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 40, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 100, height: 13 }} /></td>
                  <td><div className="skeleton" style={{ width: 60, height: 13 }} /></td>
                </tr>
              ))}

              {/* Error state */}
              {!loading && error && (
                <tr><td colSpan={8} className="subs-td-msg">
                  <span style={{ color: "var(--red)" }}>⚠ {error}</span>
                </td></tr>
              )}

              {/* Empty state */}
              {!loading && !error && filteredSubs.length === 0 && (
                <tr><td colSpan={8} className="subs-td-msg">
                  <div className="subs-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>{searchQuery ? "No matching submissions found" : "No submissions yet"}</p>
                    <span>
                      {searchQuery
                        ? "Try a different problem name or filter."
                        : "Solve a problem to see your history here!"}
                    </span>
                    {!searchQuery && (
                      <button className="subs-go-btn" onClick={() => navigate("/problems")}>
                        Browse Problems →
                      </button>
                    )}
                  </div>
                </td></tr>
              )}

              {/* Data rows */}
              {!loading && !error && filteredSubs.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={`subs-row ${idx % 2 === 0 ? "" : "alt"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedSub(sub)}
                >
                  <td className="sub-num">
                    {(pagination.page - 1) * 15 + idx + 1}
                  </td>
                  <td className="sub-title">
                    <div className="sub-title-inner">
                      <span className="sub-problem-num">#{sub.problem?.problemNumber}</span>
                      <span className="sub-problem-title">{sub.problem?.title || "Problem"}</span>
                      {sub.problem?.difficulty && (
                        <span className={`diff-badge ${sub.problem.difficulty}`}>
                          {sub.problem.difficulty.charAt(0).toUpperCase() + sub.problem.difficulty.slice(1)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`sub-status-badge ${sub.status}`}>
                      {sub.status === "accepted" ? "✓" : "✗"} {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className="sub-tests">{sub.passedTests}/{sub.totalTests}</td>
                  <td className="sub-runtime">{sub.runtime != null ? `${sub.runtime}ms` : "—"}</td>
                  <td className="sub-lang">
                    <code>{(sub.language || "cpp").toUpperCase()}</code>
                  </td>
                  <td className="sub-date">{formatDate(sub.createdAt)}</td>
                  <td className="sub-action-cell" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="sub-view-btn"
                      onClick={() => setSelectedSub(sub)}
                      title="View submitted code and verdict"
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="subs-pagination">
            <span className="pag-summary">
              Showing {(pagination.page - 1) * 15 + 1}–{Math.min(pagination.page * 15, pagination.total)} of {pagination.total} submissions
            </span>
            <div className="pag-controls">
              <button
                className="pag-btn"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Prev
              </button>
              <span className="pag-info">Page {pagination.page} of {pagination.totalPages}</span>
              <button
                className="pag-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SUBMISSION DETAIL MODAL ── */}
      {selectedSub && (
        <div className="sub-modal-backdrop" onClick={() => setSelectedSub(null)}>
          <div className="sub-modal-card" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="sub-modal-header">
              <div className="sub-modal-title-group">
                <span className="sub-modal-num">#{selectedSub.problem?.problemNumber}</span>
                <h2 className="sub-modal-title">{selectedSub.problem?.title}</h2>
                {selectedSub.problem?.difficulty && (
                  <span className={`diff-badge ${selectedSub.problem.difficulty}`}>
                    {selectedSub.problem.difficulty.charAt(0).toUpperCase() + selectedSub.problem.difficulty.slice(1)}
                  </span>
                )}
              </div>
              <button className="sub-modal-close" onClick={() => setSelectedSub(null)} title="Close">✕</button>
            </div>

            {/* Metrics row */}
            <div className="sub-modal-metrics">
              <div className="sub-mitem">
                <span className="sub-mlbl">Verdict</span>
                <span className={`sub-status-badge ${selectedSub.status}`}>
                  {selectedSub.status === "accepted" ? "✓" : "✗"}{" "}
                  {STATUS_LABELS[selectedSub.status] ?? selectedSub.status}
                </span>
              </div>
              <div className="sub-mitem">
                <span className="sub-mlbl">Testcases</span>
                <span className="sub-mval">{selectedSub.passedTests} / {selectedSub.totalTests}</span>
              </div>
              <div className="sub-mitem">
                <span className="sub-mlbl">Runtime</span>
                <span className="sub-mval">{selectedSub.runtime != null ? `${selectedSub.runtime}ms` : "—"}</span>
              </div>
              {selectedSub.memory != null && selectedSub.memory > 0 && (
                <div className="sub-mitem">
                  <span className="sub-mlbl">Memory</span>
                  <span className="sub-mval">{selectedSub.memory} KB</span>
                </div>
              )}
              <div className="sub-mitem">
                <span className="sub-mlbl">Submitted</span>
                <span className="sub-mval sub-date-val">{formatDate(selectedSub.createdAt)}</span>
              </div>
            </div>

            {/* Error log (if any) */}
            {selectedSub.error && (
              <div className="sub-modal-error">
                <span className="sub-err-title">Error / Log:</span>
                <pre>{selectedSub.error}</pre>
              </div>
            )}

            {/* Code viewer */}
            <div className="sub-modal-code-wrap">
              <div className="sub-code-toolbar">
                <span className="sub-code-lang">{(selectedSub.language || "cpp").toUpperCase()}</span>
                <button className="sub-copy-btn" onClick={() => handleCopyCode(selectedSub.code)}>
                  {copied ? "✓ Copied!" : "📋 Copy Code"}
                </button>
              </div>
              <pre className="sub-code-pre">
                <code>{selectedSub.code || "// Code not available"}</code>
              </pre>
            </div>

            {/* Footer actions */}
            <div className="sub-modal-footer">
              <button
                className="sub-open-prob-btn"
                onClick={() => {
                  const pid = selectedSub.problem?._id || selectedSub.problem;
                  navigate(`/problems/${pid}`);
                }}
              >
                Open in Editor →
              </button>
              <button className="sub-close-btn" onClick={() => setSelectedSub(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submissions;
