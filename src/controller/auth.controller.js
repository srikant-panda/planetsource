import User from "../model/user.model.js";
import validator from "validator";
import { authUtils } from "../utils/auth.utils.js";
import RefreshToken from "../model/auth.model.js"


async function registerUser(req, res) {
    try {
        const userDataSchema = [
            "name",
            "email",
            "password",
        ];
        if (Object.hasOwn(req.body, 'avatr')) userDataSchema.push('avatar');
        const isValidRequest = Object.keys(req.body).every((key) => userDataSchema.includes(key));
        if (!isValidRequest)
            return res.status(400).json({ message: "every field required and must be correct.No access key or no inefficient key" });
        const reqData = req.body;
        if (!validator.isEmail(reqData.email))
            return res.status(400).json({ message: "email should be valid." })
        if (!validator.isStrongPassword(reqData.password))
            return res.status(400).json({ message: "password should have 8 digit , one uppercase , lowercase, digit,special charecter" });
        const existingUser = await User.findOne({
            $or: [
                { email: reqData.email },
                // { username: reqData.username }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email."
            });
        }
        const hashedPassword = await authUtils.hashData(reqData.password);
        const user = await User.create({
            name: reqData.name,
            username: reqData.username,
            email: reqData.email,
            password: hashedPassword,
        })
        const accessToken = await authUtils.createToken(user._id, "15m");
        res.set("Authorization", `Bearer ${accessToken}`)
        const refreshToken = await authUtils.createToken(user._id, "7d");
        const isRefTKNStred = await authUtils.storeRefreshToken(refreshToken, user._id)
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User created",
            user
        })
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        if (err.name == "MongooseError") return res.status(500).json({ message: "Database connection gone wrong." })

        res.status(500).json({ message: "Internal server error", error: err.message, name: err.name });
    }
}


async function verifyUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Bothe email and password required." });
        if (!validator.isEmail(email))
            return res.status(400).json({ message: "email should be valid." });
        const user = await User.findOne({ email: email }).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });
        const isEqualPassword = await authUtils.compareHash(user.password, password);
        if (!isEqualPassword) return res.status(401).json({ message: "Incorrect credentials" });
        const accessToken = await authUtils.createToken(user._id, "15m");
        res.set("Authorization", `Bearer ${accessToken}`)
        const refreshToken = await authUtils.createToken(user._id, "7d");
        const isRefTKNStred = await authUtils.storeRefreshToken(refreshToken, user._id)
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            message: "User logged in successfully.",
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message, name: err.name });
    }
}


async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found." });
        res.json({
            message: "User fetched successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message, name: err.name });
    }
}


async function logout(req, res) {
    try {
        const { logOutFromAll } = req.body ?? {};
        // const refreshToken = req.cookie.refresh_token ?? null;
        const isRevoked = await RefreshToken.updateMany({ userId: req.user.id }, { revoked: true });
        if (isRevoked)
            res.json({ message: "User logged out from all device." })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message, name: err.name });

    }
}


async function refresh(req, res) {
    try {
        const newRefreshToken = await authUtils.createToken(req.user.id, "7d");
        const newAccessToken = await authUtils.createToken(req.user.id, "15m");
        const isRevoked = await RefreshToken.updateMany({ userId: req.user.id }, { revoked: true });
        const isRefTKNStred = await authUtils.storeRefreshToken(newRefreshToken, req.user.id);
        if (isRevoked) {
            res.set("Authorization", `Bearer ${newAccessToken}`)
            res.cookie("refresh_token", newRefreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({ message: "Tokens refreshed." })
        }

    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message, name: err.name });

    }
}



export const authController = {
    registerUser,
    verifyUser,
    getMe,
    logout,
    refresh
}