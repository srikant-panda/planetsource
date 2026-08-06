import mongoose from "mongoose";
import { required } from "zod/mini";

const instanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    containerName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["creating", "running", "stopped", "failed", "deleting"],
      default:"creating",
    },
    host: String,
    port: Number,
    connectionString: String,
  },
  { timestamps: true },
);


const Instance = mongoose.model("intance",instanceSchema);

export default Instance;