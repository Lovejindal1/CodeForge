const testcaseRepository = require("../repositories/testcase.repository");

const createTestCase = async (data, userId) => {
    const testcase = await testcaseRepository.create({...data,createdBy: userId});
    return testcase;
}

const getTestCasesbyProblem = async (problemId) => {
    return await testcaseRepository.findByProblem(problemId);
}

const deleteTestCase = async (id) => {
    const testCase = await testcaseRepository.deleteById(id);
    if(!testCase) throw new Error("Test case not found");
    return testCase;
}

module.exports = {
    createTestCase, getTestCasesbyProblem, deleteTestCase
}