const express = require("express");

const authController = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/register",authLimiter, authController.register);

router.post("/login",authLimiter, authController.login);


// router.post("/register", (req, res) => {

//     console.log("🔥 Register Route Hit");

//     res.json({
//         success: true
//     });

// });
module.exports = router;