import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { getCurrentUser, getRefreshTokenData } from "../middlewares/auth.middleware.js"

const authRouter = Router();


authRouter.post("/signup", authController.registerUser);
authRouter.post("/login", authController.verifyUser);
authRouter.get("/get-me", getCurrentUser, authController.getMe);  // private route
authRouter.post("/logout", getCurrentUser, authController.logout); //private route
authRouter.post("/refresh", getRefreshTokenData, authController.refresh)  // private route


export { authRouter };
