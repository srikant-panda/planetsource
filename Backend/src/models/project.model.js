import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 50,
      trim: true,
      required: true,
    },
    description: { type: String, maxlength: 500, trim: true, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
  },
  { timestamps: true },
);


projectSchema.index(
  { owner: 1, name: 1 },
  { unique: true }
);

const Project = mongoose.model("project",projectSchema);

export default Project;