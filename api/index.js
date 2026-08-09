import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "../server/database/db.js";
import userRoute from "../server/routes/userRoute.js";
import productRoute from "../server/routes/productRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Connect DB middleware for serverless requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error("Database connection middleware error:", err);
    }
    next();
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/products', productRoute);

app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Ekart API running on Vercel" });
});

export default app;
