import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const baseUri = process.env.MONGO_URI.replace(/\/+$/, "");
        await mongoose.connect(`${baseUri}/Ecom`);
        console.log("mongoDB connected successfully");
    } catch (error) {
        console.log("mongoDB connection failed:", error)
    }
}

export default connectDB;