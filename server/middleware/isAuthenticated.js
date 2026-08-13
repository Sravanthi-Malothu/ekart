


import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}
