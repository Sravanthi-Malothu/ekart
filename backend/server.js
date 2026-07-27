import cors from "cors"
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath as _fileURLToPath } from 'url'
import express from "express";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";

const __dirname = path.dirname(_fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const app=express();
const PORT=process.env.PORT ||3000

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/v1/user',userRoute)
app.use('/api/v1/products',productRoute)
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

connectDB().then(()=>{
    console.log("Database connected successfully");
}).catch((error)=>{
    console.log("Database connection failed:", error);
})