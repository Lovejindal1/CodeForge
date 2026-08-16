const mongoose = require("mongoose");
const Problem = require("./src/models/Problem.js");
const TestCase = require("./src/models/TestCase.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/leetcode-clone";

const adminId = new mongoose.Types.ObjectId("6a75b565d613e10f929f7828");

const problems = [
    {
        problemNumber: 2,
        title: "Valid Parentheses",
        description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
        difficulty: "easy",
        tags: ["string", "stack"],
        constraints: [
            "1 <= s.length <= 10^4",
            "s consists of parentheses only: '()[]{}'"
        ],
        examples: [
            {
                input: "s = \"()\"",
                output: "true",
                explanation: "The parentheses are properly closed."
            },
            {
                input: "s = \"()[]{}\"",
                output: "true",
                explanation: "All brackets are properly matched."
            },
            {
                input: "s = \"(]\"",
                output: "false",
                explanation: "The closing bracket does not match the opening bracket."
            }
        ],
        starterCode: `class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
        functionName: "isValid",
        createdBy: adminId
    },

    {
        problemNumber: 3,
        title: "Best Time to Buy and Sell Stock",
        description:
            "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell that stock. Return the maximum profit you can achieve.",
        difficulty: "easy",
        tags: ["array", "greedy"],
        constraints: [
            "1 <= prices.length <= 10^5",
            "0 <= prices[i] <= 10^4"
        ],
        examples: [
            {
                input: "prices = [7,1,5,3,6,4]",
                output: "5",
                explanation: "Buy at 1 and sell at 6."
            },
            {
                input: "prices = [7,6,4,3,1]",
                output: "0",
                explanation: "No profitable transaction is possible."
            }
        ],
        starterCode: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`,
        functionName: "maxProfit",
        createdBy: adminId
    },

    {
        problemNumber: 4,
        title: "Maximum Subarray",
        description:
            "Given an integer array nums, find the subarray with the largest sum and return its sum.",
        difficulty: "medium",
        tags: ["array", "dynamic-programming", "divide-and-conquer"],
        constraints: [
            "1 <= nums.length <= 10^5",
            "-10^4 <= nums[i] <= 10^4"
        ],
        examples: [
            {
                input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                output: "6",
                explanation: "The subarray [4,-1,2,1] has the largest sum 6."
            },
            {
                input: "nums = [1]",
                output: "1",
                explanation: "The only subarray has sum 1."
            }
        ],
        starterCode: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        
    }
};`,
        functionName: "maxSubArray",
        createdBy: adminId
    }
];

const testCases = {
    2: [
        {
            input: "()",
            expectedOutput: "true",
            isHidden: false
        },
        {
            input: "()[]{}",
            expectedOutput: "true",
            isHidden: false
        },
        {
            input: "(]",
            expectedOutput: "false",
            isHidden: false
        },
        {
            input: "([{}])",
            expectedOutput: "true",
            isHidden: false
        },
        {
            input: "([)]",
            expectedOutput: "false",
            isHidden: true
        },
        {
            input: "{[]}",
            expectedOutput: "true",
            isHidden: true
        },
        {
            input: "(((",
            expectedOutput: "false",
            isHidden: true
        },
        {
            input: "())",
            expectedOutput: "false",
            isHidden: true
        }
    ],

    3: [
        {
            input: "[7,1,5,3,6,4]",
            expectedOutput: "5",
            isHidden: false
        },
        {
            input: "[7,6,4,3,1]",
            expectedOutput: "0",
            isHidden: false
        },
        {
            input: "[1,2]",
            expectedOutput: "1",
            isHidden: false
        },
        {
            input: "[2,1]",
            expectedOutput: "0",
            isHidden: false
        },
        {
            input: "[1,2,3,4,5]",
            expectedOutput: "4",
            isHidden: true
        },
        {
            input: "[5,4,3,2,1]",
            expectedOutput: "0",
            isHidden: true
        },
        {
            input: "[3,2,6,5,0,3]",
            expectedOutput: "4",
            isHidden: true
        },
        {
            input: "[2,4,1]",
            expectedOutput: "2",
            isHidden: true
        }
    ],

    4: [
        {
            input: "[-2,1,-3,4,-1,2,1,-5,4]",
            expectedOutput: "6",
            isHidden: false
        },
        {
            input: "[1]",
            expectedOutput: "1",
            isHidden: false
        },
        {
            input: "[5,4,-1,7,8]",
            expectedOutput: "23",
            isHidden: false
        },
        {
            input: "[-1]",
            expectedOutput: "-1",
            isHidden: false
        },
        {
            input: "[-2,-3,-1,-5]",
            expectedOutput: "-1",
            isHidden: true
        },
        {
            input: "[1,2,3,4]",
            expectedOutput: "10",
            isHidden: true
        },
        {
            input: "[-2,1]",
            expectedOutput: "1",
            isHidden: true
        },
        {
            input: "[8,-19,5,-4,20]",
            expectedOutput: "21",
            isHidden: true
        }
    ]
};

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");

        for (const problemData of problems) {
            const existingProblem = await Problem.findOne({
                problemNumber: problemData.problemNumber
            });

            if (existingProblem) {
                console.log(
                    `Problem #${problemData.problemNumber} already exists. Skipping.`
                );
                continue;
            }

            const problem = await Problem.create(problemData);

            console.log(
                `Created Problem #${problem.problemNumber}: ${problem.title}`
            );

            const cases = testCases[problem.problemNumber].map((testCase) => ({
                ...testCase,
                problem: problem._id,
                createdBy: adminId
            }));

            await TestCase.insertMany(cases);

            console.log(
                `Created ${cases.length} test cases for ${problem.title}`
            );
        }

        console.log("\nSeeding completed successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();