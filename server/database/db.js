import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is missing in Vercel project settings.");
        }
        const baseUri = mongoUri.replace(/\/+$/, "");
        const uriToConnect = baseUri.includes('/Ecom') ? baseUri : `${baseUri}/Ecom`;
        await mongoose.connect(uriToConnect, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.error("mongoDB connection failed:", error.message);
        throw error;
    }
}

export default connectDB;