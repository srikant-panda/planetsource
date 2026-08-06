import User from "../models/user.model.js";
import validator from "validator";
import { authUtils } from "../utils/auth.utils.js";
import Session from "../models/auth.model.js";

async function registerUser(req, res) {
  try {
    const userDataSchema = ["name", "email", "password"];
    if (Object.hasOwn(req.body, "avatar")) userDataSchema.push("avatar");
    const isValidRequest = Object.keys(req.body).every((key) =>
      userDataSchema.includes(key),
    );
    if (!isValidRequest)
      return res.status(400).json({
        message:
          "every field required and must be correct.No access key or no inefficient key",
      });
    const reqData = req.body;
    if (!validator.isEmail(reqData.email))
      return res.status(400).json({ message: "email should be valid." });
    if (!validator.isStrongPassword(reqData.password))
      return res.status(400).json({
        message:
          "password should have 8 digit , one uppercase , lowercase, digit,special charecter",
      });
    const existingUser = await User.findOne({
      $or: [{ email: reqData.email }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email.",
      });
    }
    const hashedPassword = await authUtils.hashData(reqData.password);
    const user = await User.create({
      name: reqData.name,
      username: reqData.username,
      email: reqData.email,
      password: hashedPassword,
      avatar: reqData.avatar,
    });

    const { token:accessToken,JTI:accessTokenJTI } = await authUtils.createToken(user._id, "15m");
    res.set("Authorization", `Bearer ${accessToken}`);
    const { token:refreshToken,JTI:refreshTokenJTI } = await authUtils.createToken(user._id, "7d");
    const isRefTKNStred = await authUtils.storeSession(
      user._id,
      refreshTokenJTI
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    if (err.name == "MongooseError")
      return res
        .status(500)
        .json({ message: "Database connection gone wrong." });

    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      name: err.name,
    });
  }
}

async function verifyUser(req, res) {
  try {
    const isAlrdyLogdin = req.tokenData || null;
    console.log(isAlrdyLogdin);
    if(isAlrdyLogdin){
      return res.json({
        message:"User already logged in.",
        success:true
      })
    }
    const { email , password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Both email and password required." });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "email should be valid." });
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const isEqualPassword = await authUtils.compareHash(
      user.password,
      password,
    );
    if (!isEqualPassword)
      return res.status(401).json({ message: "Incorrect credentials" });
    const { token:accessToken,JTI:accessTokenJTI } = await authUtils.createToken(user._id, "15m");
    res.set("Authorization", `Bearer ${accessToken}`);
    const { token:refreshToken,JTI:refreshTokenJTI } = await authUtils.createToken(user._id, "7d");
    const isSesnStred = await authUtils.storeSession(
      user._id,
      refreshTokenJTI
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User logged in successfully.",
      success:true
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      name: err.name,
    });
  }
}



async function logout(req, res) {
  try {
    const { logOutFromAll } = req.body ?? {};
    // const refreshToken = req.cookie.refresh_token ?? null;
    const isRevoked = await Session.updateMany(
      { JTI: req.tokenData.JTI },
      { revoked: true },
    );
    if (isRevoked){
      res.clearCookie("refreshToken")
       res.json({ message: "User logged out from all device." });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      name: err.name,
    });
  }
}

async function refresh(req, res) {
  try {
    const { token:newRefreshToken,JTI:newRefreshTokenJTI } = await authUtils.createToken(req.tokenData.id, "7d");
    const { token:newAccessToken,JTI:newAccessTokenJTI } = await authUtils.createToken(req.tokenData.id, "15m");
    const isRevoked = await Session.updateMany(
      { JTI: req.tokenData?.JTI },
      { revoked: true },
    );
    const isSesnStred = await authUtils.storeSession(
      req.tokenData.id,
      newRefreshTokenJTI
    );
    if (isRevoked) {
      res.set("Authorization", `Bearer ${newAccessToken}`);
      res.clearCookie("refreshToken")
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ message: "Tokens refreshed." });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      name: err.name,
    });
  }
}

export const authController = {
  registerUser,
  verifyUser,
  logout,
  refresh,
};
