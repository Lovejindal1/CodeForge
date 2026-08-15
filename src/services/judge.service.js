const submissionRepository = require("../repositories/submission.repository");
const testcaseRepository = require("../repositories/testcase.repository");
const problemRepository = require("../repositories/problem.repository");

const { executeCpp } = require("./executor/cpp.executor");
const { generateCode } = require("./executor/code-generator");

const judgeSubmission = async (submissionId) => {
    // console.log("🔥 NEW JUDGE SERVICE RUNNING");
    const submission = await submissionRepository.findById(submissionId);

    if(!submission) throw new Error("Submission not found");

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

    const result = await executeCpp(executableCode, testCases);

    let passedTests = 0;
    let totalRuntime = 0;
    let maxMemory = 0;

    for (let i = 0; i < result.results.length; i++) {

        const testResult = result.results[i];

        totalRuntime += testResult.runtime || 0;
        maxMemory = Math.max(maxMemory, testResult.memory || 0);

        if (testResult.status !== "success") {

            await submissionRepository.updateById(
                submissionId, {
                    status: testResult.status, passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error: testResult.error
                }
            );

            return {
                submissionId, status: testResult.status, passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error: testResult.error
            };
        }

        const actualOutput = testResult.output.trim();

        const expectedOutput = testCases[i].expectedOutput.trim();

        if (actualOutput !== expectedOutput) {

            const error = `Expected: ${expectedOutput}, Received: ${actualOutput}`;

            await submissionRepository.updateById(
                submissionId, {
                    status: "wrong_answer", passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error
                }
            );
            return {
                submissionId, status: "wrong_answer", passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error
            };
        }
        passedTests++;
    }

    await submissionRepository.updateById(submissionId, { status: "accepted", passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error: null });

    return {
        submissionId, status: "accepted", passedTests, totalTests: testCases.length, runtime: totalRuntime, memory: maxMemory, error: null
    };
};

module.exports = {
    judgeSubmission
}