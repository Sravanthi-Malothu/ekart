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
app.use('/v1/uploads', express.static(path.join(__dirname, '../server/uploads')));

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
    res.json({ status: "ok", message: "Ekart API running" });
});

// Connect DB middleware (non-blocking fallback)
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.warn("DB connection warning:", err.message);
    }
    next();
});

// Mount routes supporting both /api/v1 and /v1 path patterns for Vercel rewrites
app.use(['/api/v1/user', '/v1/user'], userRoute);
app.use(['/api/v1/products', '/v1/products'], productRoute);

export default app;
