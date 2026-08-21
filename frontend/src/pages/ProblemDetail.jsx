import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProblemDetail.css";
import { getProblemById, getProblems } from "../services/problemService";
import { createSubmission, runCode, getMySubmissions, getSubmissionById } from "../services/submissionService";

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
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [executionMode, setExecutionMode] = useState(null); // 'run' | 'submit' | null
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [execError, setExecError] = useState("");

  const [leftTab, setLeftTab] = useState("description");
  const [problemSubs, setProblemSubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  /* prev/next problem navigation */
  const [prevProblemId, setPrevProblemId] = useState(null);
  const [nextProblemId, setNextProblemId] = useState(null);

  /* submission detail modal */
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [subDetailLoading, setSubDetailLoading] = useState(false);
  const [subDetailError, setSubDetailError] = useState("");

  /* fetch problem */
useEffect(() => {
    let cancelled = false;

    const fetchProblem = async () => {
        setLoading(true);
        setLoadError("");

        try {
            const res = await getProblemById(id);

            if (cancelled) return;

            setProblem(res.data);
            setCode(res.data.starterCode || "");

        } catch (err) {

            if (cancelled) return;

            setLoadError(
                err.response?.data?.message ||
                "Failed to load problem."
            );

        } finally {

            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    fetchProblem();

    return () => {
        cancelled = true;
    };

}, [id]);

  /* fetch full problem list (sorted by problemNumber) to determine prev/next */
  useEffect(() => {
    const fetchNeighbours = async () => {
      try {
        const res = await getProblems({ limit: 1000 });
        const list = res.data?.problems || [];
        const currentIndex = list.findIndex((p) => p._id === id);
        if (currentIndex === -1) {
          setPrevProblemId(null);
          setNextProblemId(null);
          return;
        }
        setPrevProblemId(currentIndex > 0 ? list[currentIndex - 1]._id : null);
        setNextProblemId(
          currentIndex < list.length - 1 ? list[currentIndex + 1]._id : null
        );
      } catch {
        setPrevProblemId(null);
        setNextProblemId(null);
      }
    };
    fetchNeighbours();
  }, [id]);

  const goToPrevProblem = () => {
    if (prevProblemId) navigate(`/problems/${prevProblemId}`);
  };

  const goToNextProblem = () => {
    if (nextProblemId) navigate(`/problems/${nextProblemId}`);
  };

  /* open submission detail modal */
  const openSubmissionDetail = async (submissionId) => {
    setSelectedSubmission(null);
    setSubDetailError("");
    setSubDetailLoading(true);
    try {
      const res = await getSubmissionById(submissionId);
      setSelectedSubmission(res.data);
    } catch (err) {
      setSubDetailError(err.response?.data?.message || "Failed to load submission.");
    } finally {
      setSubDetailLoading(false);
    }
  };

  const closeSubmissionDetail = () => {
    setSelectedSubmission(null);
    setSubDetailError("");
    setSubDetailLoading(false);
  };

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
    } catch { }
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

  /* Run Code (Sample Test Cases only, no submission saved in DB) */
  const handleRun = async () => {
    if (running || submitting) return;
    setRunning(true);
    setExecError("");
    setExecutionMode("run");
    setActiveCaseIndex(0);
    try {
      const res = await runCode({ problem: id, language: "cpp", code });
      setRunResult(res.data);
    } catch (err) {
      setExecError(err.response?.data?.message || "Code execution failed. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  /* Submit (All Test Cases, judged & recorded in DB) */
  const handleSubmit = async () => {
    if (running || submitting) return;
    setSubmitting(true);
    setExecError("");
    setExecutionMode("submit");
    try {
      const res = await createSubmission({ problem: id, language: "cpp", code });
      setSubmitResult(res.data);
      if (leftTab === "submissions") {
        fetchProblemSubs();
      }
    } catch (err) {
      setExecError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Reset code back to starter code */
  const handleResetCode = () => {
    if (running || submitting) return;
    setCode(problem?.starterCode || "");
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const lineCount = code.split("\n").length;

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="dp-page">
        <div className="dp-topbar">
          <div className="dp-logo" onClick={() => navigate("/problems")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L11 20" strokeLinecap="round" />
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
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L11 20" strokeLinecap="round" />
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

  const currentResult = executionMode === "run" ? runResult : submitResult;

  return (
    <div className="dp-page">
      {/* ── TOP BAR ── */}
      <div className="dp-topbar">
        <div className="dp-topbar-left">
          <div className="dp-logo" onClick={() => navigate("/problems")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6L3 12L8 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L21 12L16 18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 4L11 20" strokeLinecap="round" />
            </svg>
            <span>CodeForge</span>
          </div>
          <span className="dp-separator">·</span>
          <button className="dp-back-btn" onClick={() => navigate("/problems")}>
            ← Problem List
          </button>
        </div>

        <div className="dp-topbar-center">
          <button
            className="dp-nav-arrow"
            onClick={goToPrevProblem}
            disabled={!prevProblemId}
            title="Previous problem"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="dp-problem-crumb">
            {problem.problemNumber}. {problem.title}
          </span>
          <button
            className="dp-nav-arrow"
            onClick={goToNextProblem}
            disabled={!nextProblemId}
            title="Next problem"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="dp-topbar-right">
          <div className="dp-actions-group">
            {/* RUN BUTTON */}
            <button
              id="run-code-btn"
              className={`dp-run-btn ${running ? "loading" : ""}`}
              onClick={handleRun}
              disabled={running || submitting}
              title="Run code on sample test cases"
            >
              {running ? (
                <><span className="btn-spin" />Running...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4" />
                  </svg>
                  Run Code
                </>
              )}
            </button>

            {/* SUBMIT BUTTON */}
            <button
              id="submit-code-btn"
              className={`dp-submit-btn ${submitting ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={running || submitting}
              title="Submit code for full evaluation"
            >
              {submitting ? (
                <><span className="btn-spin" />Judging...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Submit
                </>
              )}
            </button>
          </div>
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
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
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
                      <div
                        key={sub._id}
                        className="dp-sub-row clickable"
                        onClick={() => openSubmissionDetail(sub._id)}
                        role="button"
                        tabIndex={0}
                      >
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
                <span className="dp-file-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5L21 17V5a2 2 0 0 0-2-2H5z" fill="#1a4d7a" stroke="#3b82c4" strokeWidth="1" />
                    <path d="M16.5 21L21 17h-3a2 2 0 0 0-2 2v2z" fill="#3b82c4" />
                    <text x="12" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fontFamily="Consolas, monospace" fill="#7ec3ff">cpp</text>
                  </svg>
                </span>
                solution.cpp
              </div>
            </div>
            <div className="dp-editor-right">
              <button
                className="dp-reset-btn"
                onClick={handleResetCode}
                disabled={running || submitting}
                title="Reset code to starter template"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Reset
              </button>
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
              <div className="dp-console-header-left">
                <span className="dp-console-title">Console</span>
                {executionMode && (
                  <span className={`dp-mode-tag ${executionMode}`}>
                    {executionMode === "run" ? "Run Testcases" : "Submission Verdict"}
                  </span>
                )}
              </div>

              {currentResult && (
                <span className={`dp-verdict-chip ${currentResult.status}`}>
                  {currentResult.status === "accepted" ? "✓" : "✗"}{" "}
                  {STATUS_LABELS[currentResult.status] ?? currentResult.status}
                </span>
              )}
            </div>

            <div className="dp-console-body">
              {/* PLACEHOLDER */}
              {!currentResult && !execError && !running && !submitting && (
                <div className="dp-console-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>Click "Run Code" to test sample cases or "Submit" for full evaluation</p>
                </div>
              )}

              {/* RUNNING STATE */}
              {running && (
                <div className="dp-judging">
                  <div className="judging-dots">
                    <span /><span /><span />
                  </div>
                  <p>Running sample test cases...</p>
                </div>
              )}

              {/* SUBMITTING STATE */}
              {submitting && (
                <div className="dp-judging">
                  <div className="judging-dots">
                    <span /><span /><span />
                  </div>
                  <p>Judging submission against all test cases...</p>
                </div>
              )}

              {/* ERROR STATE */}
              {execError && !running && !submitting && (
                <div className="dp-result-error">
                  <span className="result-icon-x">✗</span>
                  <span>{execError}</span>
                </div>
              )}

              {/* ── RUN RESULTS (Sample Testcases) ── */}
              {executionMode === "run" && runResult && !running && (
                <div className="dp-result-content">
                  <div className="dp-result-summary">
                    <div className="drs-meta">
                      <span className="drs-tests">
                        {runResult.passedTests}/{runResult.totalTests} sample cases passed
                      </span>
                      {runResult.runtime != null && (
                        <span className="drs-chip">⏱ {runResult.runtime}ms</span>
                      )}
                      {runResult.memory != null && runResult.memory > 0 && (
                        <span className="drs-chip">💾 {runResult.memory}KB</span>
                      )}
                    </div>
                  </div>

                  {/* Compile/Execution Error */}
                  {runResult.error && runResult.results?.length === 0 && (
                    <div className="dp-tc failed">
                      <div className="dp-tc-header">
                        <span className="dp-tc-num">Execution Error</span>
                      </div>
                      <div className="dp-tc-body">
                        <pre className="dp-error-pre">{runResult.error}</pre>
                      </div>
                    </div>
                  )}

                  {/* Case Switcher Tabs */}
                  {runResult.results?.length > 0 && (
                    <div className="dp-run-container">
                      <div className="dp-case-tabs">
                        {runResult.results.map((tc, idx) => (
                          <button
                            key={idx}
                            className={`dp-case-tab ${activeCaseIndex === idx ? "active" : ""} ${tc.status === "accepted" ? "pass" : "fail"}`}
                            onClick={() => setActiveCaseIndex(idx)}
                          >
                            <span className={`case-indicator ${tc.status === "accepted" ? "pass" : "fail"}`}>
                              {tc.status === "accepted" ? "✓" : "✗"}
                            </span>
                            Case {idx + 1}
                          </button>
                        ))}
                      </div>

                      {/* Selected Case Content */}
                      {runResult.results[activeCaseIndex] && (
                        <div className="dp-case-detail">
                          <div className="dp-tc-row">
                            <span className="tc-k">Input</span>
                            <code>{runResult.results[activeCaseIndex].input}</code>
                          </div>
                          <div className="dp-tc-row">
                            <span className="tc-k">Expected</span>
                            <code>{runResult.results[activeCaseIndex].expectedOutput}</code>
                          </div>
                          {runResult.results[activeCaseIndex].actualOutput !== null && (
                            <div className="dp-tc-row">
                              <span className="tc-k">Actual Output</span>
                              <code className={runResult.results[activeCaseIndex].status === "accepted" ? "correct" : "wrong"}>
                                {runResult.results[activeCaseIndex].actualOutput}
                              </code>
                            </div>
                          )}
                          {runResult.results[activeCaseIndex].error && (
                            <div className="dp-tc-row">
                              <span className="tc-k">Error</span>
                              <pre className="dp-error-pre">{runResult.results[activeCaseIndex].error}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── SUBMIT RESULTS (Full Suite) ── */}
              {executionMode === "submit" && submitResult && !submitting && (
                <div className="dp-result-content">
                  <div className="dp-result-summary">
                    <div className="drs-meta">
                      <span className="drs-tests">
                        {submitResult.passedTests}/{submitResult.totalTests} test cases passed
                      </span>
                      {submitResult.runtime != null && (
                        <span className="drs-chip">⏱ {submitResult.runtime}ms</span>
                      )}
                      {submitResult.memory != null && submitResult.memory > 0 && (
                        <span className="drs-chip">💾 {submitResult.memory}KB</span>
                      )}
                    </div>
                  </div>

                  {/* Sample passed list */}
                  {submitResult.sampleResults?.length > 0 && (
                    <div className="dp-testcases">
                      {submitResult.sampleResults.map((tc) => (
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
                  {submitResult.failedCase && (
                    <div className="dp-tc failed">
                      <div className="dp-tc-header">
                        <span className="dp-tc-num">
                          ✗ Case {submitResult.failedCase.index}
                          {submitResult.failedCase.isHidden ? " (Hidden Testcase)" : ""}
                        </span>
                        <span className="dp-tc-verdict failed">
                          {STATUS_LABELS[submitResult.failedCase.status] ?? submitResult.failedCase.status}
                        </span>
                      </div>
                      <div className="dp-tc-body">
                        <div className="dp-tc-row"><span className="tc-k">Input</span><code>{submitResult.failedCase.input}</code></div>
                        <div className="dp-tc-row"><span className="tc-k">Expected</span><code>{submitResult.failedCase.expectedOutput}</code></div>
                        {submitResult.failedCase.actualOutput !== null && (
                          <div className="dp-tc-row"><span className="tc-k">Got</span><code className="wrong">{submitResult.failedCase.actualOutput}</code></div>
                        )}
                        {submitResult.failedCase.error && (
                          <pre className="dp-error-pre">{submitResult.failedCase.error}</pre>
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

      {/* ── SUBMISSION DETAIL MODAL ── */}
      {(subDetailLoading || selectedSubmission || subDetailError) && (
        <div className="dp-modal-overlay" onClick={closeSubmissionDetail}>
          <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dp-modal-header">
              <span className="dp-modal-title">
                {selectedSubmission
                  ? `Submission · ${STATUS_LABELS[selectedSubmission.status] ?? selectedSubmission.status}`
                  : "Submission"}
              </span>
              <button className="dp-modal-close" onClick={closeSubmissionDetail}>✕</button>
            </div>

            <div className="dp-modal-body">
              {subDetailLoading && (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <div className="spinner" />
                </div>
              )}

              {!subDetailLoading && subDetailError && (
                <div className="dp-result-error">
                  <span className="result-icon-x">✗</span>
                  <span>{subDetailError}</span>
                </div>
              )}

              {!subDetailLoading && selectedSubmission && (
                <>
                  <div className="dp-result-summary">
                    <div className="drs-meta">
                      <span className={`dp-verdict-chip ${selectedSubmission.status}`}>
                        {selectedSubmission.status === "accepted" ? "✓" : "✗"}{" "}
                        {STATUS_LABELS[selectedSubmission.status] ?? selectedSubmission.status}
                      </span>
                      <span className="drs-tests">
                        {selectedSubmission.passedTests}/{selectedSubmission.totalTests} test cases passed
                      </span>
                      {selectedSubmission.runtime != null && (
                        <span className="drs-chip">⏱ {selectedSubmission.runtime}ms</span>
                      )}
                      {selectedSubmission.memory != null && selectedSubmission.memory > 0 && (
                        <span className="drs-chip">💾 {selectedSubmission.memory}KB</span>
                      )}
                      <span className="drs-chip">{formatDate(selectedSubmission.createdAt)}</span>
                    </div>
                  </div>

                  {selectedSubmission.error && (
                    <div className="dp-tc failed" style={{ marginTop: 12 }}>
                      <div className="dp-tc-header">
                        <span className="dp-tc-num">Error</span>
                      </div>
                      <div className="dp-tc-body">
                        <pre className="dp-error-pre">{selectedSubmission.error}</pre>
                      </div>
                    </div>
                  )}

                  <div className="dp-modal-code-label">Submitted Code (C++)</div>
                  <pre className="dp-modal-code">{selectedSubmission.code}</pre>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDetail;