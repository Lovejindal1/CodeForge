import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProblemList.css";
import { getProblems } from "../services/problemService";

const DIFFICULTIES = ["all", "easy", "medium", "hard"];

function ProblemList() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (difficulty !== "all") params.difficulty = difficulty;

      const res = await getProblems(params);

      setProblems(res.data.problems);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load problems. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, difficulty]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProblems();
  };

  const handleDifficultyClick = (level) => {
    setDifficulty(level);
    setPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="problems-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-symbol">&lt;/&gt;</div>
          <span>CodeForge</span>
        </div>

        <div className="nav-links">
          <span className="nav-link active">Problems</span>
          <span className="nav-link">Submissions</span>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="problems-container">

        <div className="problems-header">
          <p className="small-text">SHARPEN YOUR SKILLS</p>
          <h1>Problem Set</h1>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="difficulty-filters">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                className={`filter-chip ${level} ${
                  difficulty === level ? "active" : ""
                }`}
                onClick={() => handleDifficultyClick(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

        </div>

        {/* CONTENT */}
        {loading && <p className="status-text">Loading problems...</p>}

        {error && <p className="status-text error-text">{error}</p>}

        {!loading && !error && problems.length === 0 && (
          <p className="status-text">
            No problems found. Try a different search or filter.
          </p>
        )}

        {!loading && !error && problems.length > 0 && (
          <div className="problem-list">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="problem-card"
                onClick={() => navigate(`/problems/${problem._id}`)}
              >
                <div className="problem-main">
                  <span className="problem-number">
                    #{problem.problemNumber}
                  </span>
                  <span className="problem-title">{problem.title}</span>
                </div>

                <div className="problem-meta">
                  <div className="problem-tags">
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className={`difficulty-badge ${problem.difficulty}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && problems.length > 0 && (
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

export default ProblemList;
