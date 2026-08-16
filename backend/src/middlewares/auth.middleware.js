const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) =>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token Format"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });
    }
}

const adminMiddleware = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
    next();
}

module.exports = {authMiddleware,adminMiddleware};