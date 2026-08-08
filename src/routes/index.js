const express = require('express');
const {authMiddleware,adminMiddleware} = require("../middlewares/auth.middleware");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "LeetCode Clone API",
    })
});

// router.get("/profile",authMiddleware,(req, res) => {
//         res.json({
//             success: true,
//             user: req.user
//         });
//     }
// );

// router.get(
//     "/admin-test",
//     authMiddleware,
//     adminMiddleware,
//     (req, res) => {
//         res.status(200).json({
//             success: true,
//             message: "You are an admin",
//             user: req.user
//         });

//     }
// );


router.use("/auth", authRoutes);

router.use("/users", userRoutes);

module.exports=router;