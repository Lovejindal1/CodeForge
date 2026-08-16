const { executeCpp } = require("./cpp.executor");

const getExecutor = (language) => {

    switch (language) {

        case "cpp":
            return executeCpp;

        default:
            throw new Error(
                `Unsupported language: ${language}`
            );
    }
};

module.exports = {
    getExecutor
};