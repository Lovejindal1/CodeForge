const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.register);

// router.post("/register", (req, res) => {

//     console.log("🔥 Register Route Hit");

//     res.json({
//         success: true
//     });

// });
module.exports = router;