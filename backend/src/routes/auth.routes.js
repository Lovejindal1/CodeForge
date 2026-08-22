const express = require("express");

const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/register", authLimiter, authController.register);

router.post("/login", authLimiter, authController.login);

router.post("/logout", authMiddleware, authController.logout);


// router.post("/register", (req, res) => {

//     console.log("🔥 Register Route Hit");

//     res.json({
//         success: true
//     });

// });
module.exports = router;