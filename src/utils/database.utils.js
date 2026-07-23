import mongoose from "mongoose";
import { config } from "../../config.js";

export const connectDb = async () => {
    try {
        const db = await mongoose.connect(config.MONGO_URI);
        return db
    } catch (err) {
        console.log(err.name)
    }
}