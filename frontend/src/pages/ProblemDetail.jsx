import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProblemDetail.css";
import { getProblemById } from "../services/problemService";
import { createSubmission } from "../services/submissionService";

const STATUS_LABELS = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  compile_error: "Compile Error",
  time_limit_exceeded: "Time Limit Exceeded",
  pending: "Pending",
  running: "Running",
};

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const res = await getProblemById(id);
        setProblem(res.data);
        setCode(res.data.starterCode || "");
      } catch (err) {
        setLoadError(
          err.response?.data?.message ||
          "Failed to load problem. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const { selectionStart, selectionEnd, value } = e.target;

      const newValue =
        value.substring(0, selectionStart) +
        "    " +
        value.substring(selectionEnd);

      setCode(newValue);

      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    setResult(null);

    try {
      const res = await createSubmission({
        problem: id,
        language: "cpp",
        code,
      });
      setResult(res.data);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
        "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <p className="status-text">Loading problem...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="detail-page">
        <p className="status-text error-text">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="detail-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate("/problems")}>
          <div className="logo-symbol">&lt;/&gt;</div>
          <span>CodeForge</span>
        </div>

        <button className="back-button" onClick={() => navigate("/problems")}>
          ← Back to Problems
        </button>
      </nav>

      <div className="detail-container">

        {/* LEFT: PROBLEM INFO */}
        <div className="info-panel">

          <div className="info-header">
            <span className="problem-number">#{problem.problemNumber}</span>
            <h1>{problem.title}</h1>
            <span className={`difficulty-badge ${problem.difficulty}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="tags-row">
            {problem.tags?.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>

          <p className="description">{problem.description}</p>

          {problem.examples?.length > 0 && (
            <div className="examples-block">
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="example-card">
                  <p className="example-title">Example {idx + 1}</p>
                  <p><span className="example-label">Input:</span> {ex.input}</p>
                  <p><span className="example-label">Output:</span> {ex.output}</p>
                  {ex.explanation && (
                    <p><span className="example-label">Explanation:</span> {ex.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.constraints?.length > 0 && (
            <div className="constraints-block">
              <p className="section-title">Constraints</p>
              <ul>
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* RIGHT: EDITOR */}
        <div className="editor-panel">

          <div className="editor-toolbar">
            <span className="language-badge">C++</span>
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Judging..." : "Submit"}
            </button>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleTabKey}
            spellCheck="false"
          />

          <div className="result-panel">

            {submitError && (
              <p className="status-text error-text">{submitError}</p>
            )}

            {result && (
              <div className="result-content">
                <span className={`result-status ${result.status}`}>
                  {STATUS_LABELS[result.status] || result.status}
                </span>

                <span className="result-tests">
                  {result.passedTests}/{result.totalTests} test cases passed
                </span>

                {result.runtime != null && (
                  <span className="result-meta">Runtime: {result.runtime}ms</span>
                )}

                {result.memory != null && result.memory > 0 && (
                  <span className="result-meta">Memory: {result.memory}KB</span>
                )}

                {result.error && (
                  <pre className="result-error">{result.error}</pre>
                )}
              </div>
            )}

            {!result && !submitError && (
              <p className="status-text">
                Write your solution and hit Submit to run it against the test cases.
              </p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProblemDetail;
