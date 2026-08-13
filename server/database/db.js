import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return true;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.warn("MONGO_URI is missing in environment variables. Operating in fallback mode.");
            return false;
        }
        const baseUri = mongoUri.replace(/\/+$/, "");
        const uriToConnect = baseUri.includes('/Ecom') ? baseUri : `${baseUri}/Ecom`;
        await mongoose.connect(uriToConnect, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
        console.log("mongoDB connected successfully");
        return true;
    } catch (error) {
        console.error("mongoDB connection failed:", error.message);
        return false;
    }
}

export default connectDB;