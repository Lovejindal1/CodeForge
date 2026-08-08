const express = require("express");

const router = express.Router();

const {authMiddleware, adminMiddleware} = require("../middlewares/auth.middleware");


router.post( "/", authMiddleware, adminMiddleware, problemController.createProblem);