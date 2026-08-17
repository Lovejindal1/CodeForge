import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProblemDetail.css";
import { getProblemById } from "../services/problemService";
import { createSubmission, getMySubmissions } from "../services/submissionService";

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
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const [leftTab, setLeftTab] = useState("description");
  const [problemSubs, setProblemSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  /* fetch problem */
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await getProblemById(id);
        setProblem(res.data);
        setCode(res.data.starterCode || "");
      } catch (err) {
        setLoadError(err.response?.data?.message || "Failed to load problem.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  /* fetch submissions for this problem */
  const fetchProblemSubs = async () => {
    setSubsLoading(true);
    try {
      const res = await getMySubmissions({ limit: 20 });
      const all = res.data.submissions || [];
      const filtered = all.filter(
        (s) => (s.problem?._id ?? s.problem) === id
      );
      setProblemSubs(filtered);
    } catch {}
    setSubsLoading(false);
  };

  const handleTabChange = (tab) => {
    setLeftTab(tab);
    if (tab === "submissions") fetchProblemSubs();
  };

  /* Tab key in editor */
  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const next = value.substring(0, selectionStart) + "    " + value.substring(selectionEnd);
      setCode(next);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      });
    }
  };

  /* Sync gutter scroll with textarea */
  const handleEditorScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  /* Submit */
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    setResult(null);
    try {
      const res = await createSubmission({ problem: id, language: "cpp", code });
      setResult(res.data);
      if (leftTab === "submissions") fetchProblemSubs();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });

  const lineCount = code.split("\n").length;

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="dp-page">
        <div className="dp-topbar">
          <div className="dp-logo" onClick={() => navigate("/problems")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" strokeLinecap="round"/>
            </svg>
            <span>CodeForge</span>
          </div>
        </div>
        <div className="dp-center">
          <div className="spinner" />
          <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>Loading problem...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="dp-page">
        <div className="dp-topbar">
          <div className="dp-logo" onClick={() => navigate("/problems")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" strokeLinecap="round"/>
            </svg>
            <span>CodeForge</span>
          </div>
        </div>
        <div className="dp-center">
          <p style={{ color: "var(--red)" }}>{loadError}</p>
          <button className="dp-back-btn" onClick={() => navigate("/problems")} style={{ marginTop: 16 }}>
            ← Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-page">
      {/* ── TOP BAR ── */}
      <div className="dp-topbar">
        <div className="dp-topbar-left">
          <div className="dp-logo" onClick={() => navigate("/problems")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L11 20" strokeLinecap="round"/>
            </svg>
            <span>CodeForge</span>
          </div>
          <span className="dp-separator">·</span>
          <button className="dp-back-btn" onClick={() => navigate("/problems")}>
            ← Problem List
          </button>
        </div>

        <div className="dp-topbar-center">
          <span className="dp-problem-crumb">
            {problem.problemNumber}. {problem.title}
          </span>
        </div>

        <div className="dp-topbar-right">
          <button
            className={`dp-submit-btn ${submitting ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <><span className="btn-spin" />Judging...</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── SPLIT PANE ── */}
      <div className="dp-split">
        {/* ── LEFT: DESCRIPTION / SUBMISSIONS ── */}
        <div className="dp-left">
          <div className="dp-panel-tabs">
            <button
              className={`dp-ptab ${leftTab === "description" ? "active" : ""}`}
              onClick={() => handleTabChange("description")}
            >
              Description
            </button>
            <button
              className={`dp-ptab ${leftTab === "submissions" ? "active" : ""}`}
              onClick={() => handleTabChange("submissions")}
            >
              Submissions
            </button>
          </div>

          <div className="dp-panel-body">
            {/* DESCRIPTION TAB */}
            {leftTab === "description" && (
              <div className="dp-desc">
                <div className="dp-title-row">
                  <h1 className="dp-problem-title">
                    {problem.problemNumber}. {problem.title}
                  </h1>
                  <span className={`diff-badge ${problem.difficulty}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                </div>

                {problem.tags?.length > 0 && (
                  <div className="dp-tags">
                    {problem.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="dp-description-text">
                  {problem.description}
                </div>

                {problem.examples?.length > 0 && (
                  <div className="dp-examples">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="dp-example">
                        <div className="dp-example-label">Example {i + 1}</div>
                        <div className="dp-example-block">
                          <div className="dp-example-line">
                            <span className="ex-key">Input:</span>
                            <code>{ex.input}</code>
                          </div>
                          <div className="dp-example-line">
                            <span className="ex-key">Output:</span>
                            <code>{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className="dp-example-line">
                              <span className="ex-key">Explanation:</span>
                              <span className="ex-val">{ex.explanation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints?.length > 0 && (
                  <div className="dp-constraints">
                    <div className="dp-section-title">Constraints</div>
                    <ul className="dp-constraint-list">
                      {problem.constraints.map((c, i) => (
                        <li key={i}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* SUBMISSIONS TAB */}
            {leftTab === "submissions" && (
              <div className="dp-subs-tab">
                <div className="dp-subs-header">
                  <span className="dp-subs-title">My Submissions</span>
                  <button className="dp-refresh-btn" onClick={fetchProblemSubs}>↻ Refresh</button>
                </div>

                {subsLoading && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "32px" }}>
                    <div className="spinner" />
                  </div>
                )}

                {!subsLoading && problemSubs.length === 0 && (
                  <div className="dp-subs-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>No submissions for this problem yet.</p>
                    <span>Submit your solution to see results here.</span>
                  </div>
                )}

                {!subsLoading && problemSubs.length > 0 && (
                  <div className="dp-subs-list">
                    <div className="dp-subs-thead">
                      <span>Status</span>
                      <span>Tests</span>
                      <span>Runtime</span>
                      <span>When</span>
                    </div>
                    {problemSubs.map((sub) => (
                      <div key={sub._id} className="dp-sub-row">
                        <span className={`dp-sub-status ${sub.status}`}>
                          {sub.status === "accepted" ? "✓" : "✗"} {STATUS_LABELS[sub.status] ?? sub.status}
                        </span>
                        <span className="dp-sub-tests">
                          {sub.passedTests}/{sub.totalTests}
                        </span>
                        <span className="dp-sub-rt">
                          {sub.runtime != null ? `${sub.runtime}ms` : "—"}
                        </span>
                        <span className="dp-sub-date">{formatDate(sub.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: EDITOR ── */}
        <div className="dp-right">
          {/* EDITOR TOPBAR */}
          <div className="dp-editor-bar">
            <div className="dp-editor-tabs">
              <div className="dp-editor-tab active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="file-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                solution.cpp
              </div>
            </div>
            <div className="dp-editor-right">
              <div className="dp-lang-badge">C++17</div>
            </div>
          </div>

          {/* CODE EDITOR */}
          <div className="dp-editor-wrap">
            <div className="dp-gutter" ref={gutterRef}>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="dp-line-num">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="dp-code-area"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              onScroll={handleEditorScroll}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              placeholder="// Write your C++ solution here..."
            />
          </div>

          {/* RESULT / CONSOLE PANEL */}
          <div className="dp-console">
            <div className="dp-console-header">
              <span className="dp-console-title">Console</span>
              {result && (
                <span className={`dp-verdict-chip ${result.status}`}>
                  {result.status === "accepted" ? "✓" : "✗"} {STATUS_LABELS[result.status]}
                </span>
              )}
            </div>

            <div className="dp-console-body">
              {!result && !submitError && !submitting && (
                <div className="dp-console-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Submit your code to see test results</p>
                </div>
              )}

              {submitting && (
                <div className="dp-judging">
                  <div className="judging-dots">
                    <span /><span /><span />
                  </div>
                  <p>Judging your submission...</p>
                </div>
              )}

              {submitError && !submitting && (
                <div className="dp-result-error">
                  <span className="result-icon-x">✗</span>
                  <span>{submitError}</span>
                </div>
              )}

              {result && !submitting && (
                <div className="dp-result-content">
                  {/* Summary row */}
                  <div className="dp-result-summary">
                    <div className="drs-meta">
                      <span className="drs-tests">
                        {result.passedTests}/{result.totalTests} test cases passed
                      </span>
                      {result.runtime != null && (
                        <span className="drs-chip">⏱ {result.runtime}ms</span>
                      )}
                      {result.memory != null && result.memory > 0 && (
                        <span className="drs-chip">💾 {result.memory}KB</span>
                      )}
                    </div>
                  </div>

                  {/* Passed test cases */}
                  {result.sampleResults?.length > 0 && (
                    <div className="dp-testcases">
                      {result.sampleResults.map((tc) => (
                        <div key={tc.index} className="dp-tc passed">
                          <div className="dp-tc-header">
                            <span className="dp-tc-num">✓ Case {tc.index}</span>
                            <span className="dp-tc-verdict passed">Passed</span>
                          </div>
                          <div className="dp-tc-body">
                            <div className="dp-tc-row"><span className="tc-k">Input</span><code>{tc.input}</code></div>
                            <div className="dp-tc-row"><span className="tc-k">Expected</span><code>{tc.expectedOutput}</code></div>
                            <div className="dp-tc-row"><span className="tc-k">Output</span><code>{tc.actualOutput}</code></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Failed case */}
                  {result.failedCase && (
                    <div className="dp-tc failed">
                      <div className="dp-tc-header">
                        <span className="dp-tc-num">
                          ✗ Case {result.failedCase.index}
                          {result.failedCase.isHidden ? " (Hidden)" : ""}
                        </span>
                        <span className="dp-tc-verdict failed">
                          {STATUS_LABELS[result.failedCase.status] ?? result.failedCase.status}
                        </span>
                      </div>
                      <div className="dp-tc-body">
                        <div className="dp-tc-row"><span className="tc-k">Input</span><code>{result.failedCase.input}</code></div>
                        <div className="dp-tc-row"><span className="tc-k">Expected</span><code>{result.failedCase.expectedOutput}</code></div>
                        {result.failedCase.actualOutput !== null && (
                          <div className="dp-tc-row"><span className="tc-k">Got</span><code className="wrong">{result.failedCase.actualOutput}</code></div>
                        )}
                        {result.failedCase.error && (
                          <pre className="dp-error-pre">{result.failedCase.error}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
