import User from "../models/user.model.js";
// import { getCurrentUser} from "../middlewares/auth.middleware.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.tokenData.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({
      message: "User fetched successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      name: err.name,
    });
  }
}