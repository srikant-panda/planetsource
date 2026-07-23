import User from "../model/user.model.js";
import validator from "validator";
import { authUtils } from "../utils/auth.utils.js"

async function registerUser(req, res) {
    try {
        const userDataSchema = [
            "name",
            "username",
            "email",
            "password",
        ];
        const isValidRequest = userDataSchema.every((key) => Object.hasOwn(req.body, key));
        if (!isValidRequest)
            return res.status(400).json({ message: "every field required and must be correct." });
        const reqData = req.body;
        if (!validator.isEmail(reqData.email))
            return res.status(400).json({ message: "email should be valid." })
        if (!validator.isStrongPassword(reqData.password))
            return res.status(400).json({ message: "passowrd should have 8 digit , one uppercase , lowercase, digit,special charecter" });
        const existingUser = await User.findOne({
            $or: [
                { email: reqData.email },
                { username: reqData.username }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists."
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
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }

        res.status(500).json({ message: "Internal server error", error: err.message, name:err.name});
    }
}  



export const authController = {
    registerUser
}