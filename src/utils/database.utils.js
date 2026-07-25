import mongoose from "mongoose";
import { config } from "../../config.js";

export const connectDb = async () => {
    try {
        const db = await mongoose.connect(config.MONGO_URI);
        console.log("Database connected successfull");
        // console.log(db);
        return db
    } catch (err) {
        console.log("Database connection failed".err.name)
    }
}