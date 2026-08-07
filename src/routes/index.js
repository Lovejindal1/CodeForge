const express = require('express');

const authRoutes = require("./auth.routes");
const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "LeetCode Clone API",
    })
});

router.use("/auth", authRoutes);

module.exports=router;