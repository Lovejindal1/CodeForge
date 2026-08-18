const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15*60*1000, // 1 minute
    max: 10, // 10 req per windowMs per IP
    message: {
        success: false,
        message: "Too many attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false
})

const submissionLimiter = rateLimit({
    windowMs: 1*60*1000,
    max: 5, // 5 req per minute per IP
    message: {
        success: false,
        message: "Too many submission, Please slow down"
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = { authLimiter, submissionLimiter };