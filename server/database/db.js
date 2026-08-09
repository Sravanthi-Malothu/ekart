import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        isConnected = true;
        return;
    }

    try {
        const baseUri = process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/+$/, "") : "";
        await mongoose.connect(`${baseUri}/Ecom`);
        isConnected = true;
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.log("mongoDB connection failed:", error);
    }
}

export default connectDB;