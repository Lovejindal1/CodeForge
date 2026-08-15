const mongoose = require("mongoose");
const { trim } = require("validator");

const problemSchema = new mongoose.Schema(
    {
        problemNumber: {
            type: Number,
            required: true,
            unique: true
        },
        title: {
            type: String, 
            required: true,
            trim: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },
        tags: [
            {
            type: String,
            trim: true
            }
        ],
        constraints: [  
            {
            type: String
            }
        ],
        examples: [
            {
                input: {
                    type: String,
                    required: true
                },
                output: {
                    type: String,
                    required: true
                },

                explanation: {
                    type: String
                }
            }
        ],
        starterCode: {
            type: String
        },
        functionName: {
            type: String
        },
        judgeConfig: {
            returnType: {
                type: String,
                required: true
            },
            parameters: [
                {
                    name: {
                        type: String,
                        required: true
                    },
                    type: {
                        type: String,
                        required: true
                    }
                }
            ]
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Problem", problemSchema);