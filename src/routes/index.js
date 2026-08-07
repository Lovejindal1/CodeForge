const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware");

const authRoutes = require("./auth.routes");
const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "LeetCode Clone API",
    })
});


router.get("/profile",authMiddleware,(req, res) => {
        res.json({
            success: true,
            user: req.user
        });
    }

);

router.use("/auth", authRoutes);

module.exports=router;