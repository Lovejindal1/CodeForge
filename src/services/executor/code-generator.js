const generateVectorIntParser = () => {
    return `
vector<int> parseVectorInt(string input) {
    input.erase(remove(input.begin(), input.end(), '['), input.end());
    input.erase(remove(input.begin(), input.end(), ']'), input.end());

    vector<int> result;

    if (input.empty()) {
        return result;
    }

    stringstream ss(input);
    string value;

    while (getline(ss, value, ',')) {
        result.push_back(stoi(value));
    }

    return result;
}
`;
};


const generateParameterParser = (parameter, index) => {

    if (parameter.type === "vector<int>") {
        return `
    vector<int> ${parameter.name} = parseVectorInt(lines[${index}]);
`;
    }

    if (parameter.type === "int") {
        return `
    int ${parameter.name} = stoi(lines[${index}]);
`;
    }

    if (parameter.type === "string") {
        return `
    string ${parameter.name} = lines[${index}];
`;
    }

    throw new Error(
        `Unsupported parameter type: ${parameter.type}`
    );
};


const generateReturnOutput = (returnType) => {

    if (returnType === "vector<int>") {
        return `
    cout << "[";

    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ",";
        cout << result[i];
    }

    cout << "]";
`;
    }

    if (returnType === "int") {
        return `
    cout << result;
`;
    }

    if (returnType === "bool") {
        return `
    cout << (result ? "true" : "false");
`;
    }

    if (returnType === "string") {
        return `
    cout << result;
`;
    }

    throw new Error(
        `Unsupported return type: ${returnType}`
    );
};


const generateCode = (problem, userCode) => {

    const judgeConfig = problem.judgeConfig;

    if (!judgeConfig) {
        throw new Error("Judge configuration not found");
    }

    const parameterDeclarations = judgeConfig.parameters
        .map((parameter, index) =>
            generateParameterParser(parameter, index)
        )
        .join("\n");

    const functionArguments = judgeConfig.parameters
        .map(parameter => parameter.name)
        .join(", ");

    const returnOutput = generateReturnOutput(
        judgeConfig.returnType
    );

    const vectorParser = judgeConfig.parameters.some(
        parameter => parameter.type === "vector<int>"
    )
        ? generateVectorIntParser()
        : "";

const normalizedUserCode = userCode.trim().endsWith(";")
    ? userCode.trim()
    : userCode.trim() + ";";

return `
#include <bits/stdc++.h>
using namespace std;

${vectorParser}

${normalizedUserCode}

int main() {

    string line;
    vector<string> lines;

    while (getline(cin, line)) {
        lines.push_back(line);
    }

${parameterDeclarations}

    Solution solution;

    ${judgeConfig.returnType} result =
        solution.${problem.functionName}(${functionArguments});

${returnOutput}

    return 0;
}
`;
};


module.exports = {
    generateCode
};