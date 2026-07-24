import mongoose from "mongoose";



const refreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    refreshTokenHash: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true }
}, { timestamps: true })


const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;