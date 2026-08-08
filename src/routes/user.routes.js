const express = require("express");

const {authMiddleware} = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authMiddleware, userController.getCurrentUser);

router.put("/update-profile", authMiddleware, userController.updateProfile);

router.put("/change-password", authMiddleware, userController.changePassword);

module.exports = router;