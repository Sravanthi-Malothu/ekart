import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../server/database/db.js";
import userRoute from "../server/routes/userRoute.js";
import productRoute from "../server/routes/productRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Serve uploaded images statically
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Connect DB middleware for serverless requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("Database connection middleware error:", err);
        res.status(500).json({ success: false, message: "Database connection error" });
    }
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/products', productRoute);

app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Ekart API running" });
});

export default app;
