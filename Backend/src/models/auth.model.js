import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    JTI: { type: String, required: true, unique: true },
    revoked: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

const Session = mongoose.model("session", sessionSchema);
// mongoose.index(JTI=1)

export default Session;
