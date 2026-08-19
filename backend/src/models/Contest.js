const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        problems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
                required: true
            }
        ],
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },{
        timestamps: true
    }
);

const Contest = mongoose.model("Contest", contestSchema);

module.exports = Contest;