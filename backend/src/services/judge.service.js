const submissionRepository = require("../repositories/submission.repository");
const testcaseRepository = require("../repositories/testcase.repository");
const problemRepository = require("../repositories/problem.repository");

// const { executeCpp } = require("./executor/cpp.executor");
const { getExecutor } = require("./executor/executor.factory");
const { generateCode } = require("./executor/code-generator");

const judgeSubmission = async (submissionId, userId) => {
    // console.log("🔥 NEW JUDGE SERVICE RUNNING");
    const submission = await submissionRepository.findById(submissionId);

    if(!submission) throw new Error("Submission not found");

    if (submission.user._id.toString() !== userId.toString()) throw new Error("Unauthorized");

    if (submission.status === "running") throw new Error("Submission is already being judged");
    
    const problemId = submission.problem._id || submission.problem;

    const problem = await problemRepository.findById(problemId);
    
    if (!problem) {
        throw new Error("Problem not found");
    }

    const testCases = await testcaseRepository.findByProblem(submission.problem);
    if (testCases.length === 0) {
        throw new Error("No test cases found for this problem");
    }
  
    await submissionRepository.updateById(submissionId, {
        status: "running", totalTests: testCases.length, passedTests: 0, error: null
    });

    const executableCode = generateCode(problem, submission.code);

    const executor = getExecutor(submission.language);

    const result = await executor(executableCode, testCases);

    let passedTests = 0;
    let totalRuntime = 0;
    let maxMemory = 0;

    const sampleResults = [];

    let failedCase = null;

    let overallStatus = "accepted";
    let overallError = null;

    for (let i = 0; i < result.results.length; i++) {

        const testResult = result.results[i];
        const testCase = testCases[i];

        totalRuntime += testResult.runtime || 0;

        if (testResult.memory) {
            maxMemory = Math.max(maxMemory, testResult.memory);
        }

        // Execution itself failed (compile/runtime/timeout) — stop here
        if (testResult.status !== "success") {

            overallStatus = testResult.status;
            overallError = testResult.error;

            failedCase = {
                index: i + 1,
                isHidden: testCase.isHidden,
                status: testResult.status,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: null,
                error: testResult.error,
                runtime: testResult.runtime || 0
            };

            break;
        }

        const actualOutput = testResult.output.trim();
        const expectedOutput = testCase.expectedOutput.trim();

        if (actualOutput !== expectedOutput) {

            const error = `Expected: ${expectedOutput}, Received: ${actualOutput}`;

            overallStatus = "wrong_answer";
            overallError = error;

            failedCase = {
                index: i + 1,
                isHidden: testCase.isHidden,
                status: "wrong_answer",
                input: testCase.input,
                expectedOutput,
                actualOutput,
                error: null,
                runtime: testResult.runtime || 0
            };

            break;
        }

        // Passed — only surface details for non-hidden tests, hidden ones just count
        passedTests++;

        if (!testCase.isHidden) {
            sampleResults.push({
                index: i + 1,
                status: "accepted",
                input: testCase.input,
                expectedOutput,
                actualOutput,
                runtime: testResult.runtime || 0
            });
        }
    }

    await submissionRepository.updateById(submissionId, {
        status: overallStatus,
        passedTests,
        totalTests: testCases.length,
        runtime: totalRuntime,
        memory: maxMemory,
        error: overallError
    });

    return {
        submissionId,
        status: overallStatus,
        passedTests,
        totalTests: testCases.length,
        runtime: totalRuntime,
        memory: maxMemory,
        error: overallError,
        sampleResults,
        failedCase
    };
};

module.exports = {
    judgeSubmission
}