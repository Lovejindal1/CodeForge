const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs/promises");
const path = require("path");
const os = require("os");

const execAsync = promisify(exec);

const executeCpp = async (code, testCases) => {

    const tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "codeforge-")
    );

    const codePath = path.join(tempDir, "main.cpp");

    await fs.writeFile(codePath, code);

    const results = [];

    try {

        // Compile once
        const compileCommand =
            `docker run --rm ` +
            `--network none ` +
            `--memory 256m ` +
            `--cpus 1 ` +
            `--pids-limit 64 ` +
            `-v "${tempDir}:/workspace:rw" ` +
            `codeforge-cpp-runner:1.1 ` +
            `bash -c "cd /workspace && g++ main.cpp -o main"`;
        try {

            await execAsync(compileCommand, {
                timeout: 10000,
                maxBuffer: 1024 * 1024
            });

        } catch (error) {

            return {
                results: testCases.map(() => ({
                    status: "compile_error",
                    output: "",
                    error: error.stderr || error.message,
                    runtime: 0
                }))
            };
        }


        // Run every testcase
        for (const testCase of testCases) {

            const inputPath = path.join(
                tempDir,
                `input-${results.length}.txt`
            );

            await fs.writeFile(
                inputPath,
                testCase.input
            );

            const command =
                `docker run --rm -i ` +
                `--network none ` +
                `--memory 128m ` +
                `--cpus 0.5 ` +
                `--pids-limit 64 ` +
                `--read-only ` +
                `--tmpfs /tmp ` +
                `-v "${tempDir}:/workspace:rw" ` +
                `codeforge-cpp-runner:1.1 ` +
                `bash -c "cd /workspace && /usr/bin/time -f '__MEMORY__%M' timeout 2s ./main < input-${results.length}.txt"`;

            const startTime = Date.now();

            try {

                const { stdout, stderr } = await execAsync(command, {
                        timeout: 5000, maxBuffer: 1024 * 1024
                    }
                );

                const runtime = Date.now() - startTime;
                const memoryMatch = stderr.match(/__MEMORY__(\d+)/);

                const memory = memoryMatch
                    ? Number(memoryMatch[1])
                    : null;

                const cleanError = stderr
                    .replace(/__MEMORY__\d+/g, "")
                    .trim();

                results.push({
                    status: "success", output: stdout, error: stderr, runtime, memory
                });

            } catch (error) {

                const runtime = Date.now() - startTime;

                if (error.code === 124  || error.stderr?.includes("timed out") || error.stderr?.includes("timeout")) {
                    results.push({
                        status: "time_limit_exceeded",
                        output: "",
                        error: "Time limit exceeded",
                        runtime
                    });
                } else {
                    results.push({
                        status: "runtime_error",
                        output: error.stdout || "",
                        error: error.stderr || error.message,
                        runtime
                    });
                }
            }
        }
        return {
            results
        };
    } finally {
        await fs.rm(tempDir, {
            recursive: true,
            force: true
        });
    }
};

module.exports = {
    executeCpp
};