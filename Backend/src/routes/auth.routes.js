import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { getCurrentUser } from "../middlewares/auth.middleware.js"

const authRouter = Router();


authRouter.post("/signup", authController.registerUser);
authRouter.post("/login", authController.verifyUser);
authRouter.post("/logout", getCurrentUser("refresh"), authController.logout); //private route
authRouter.post("/refresh", getCurrentUser("refresh"), authController.refresh)  // private route


export { authRouter };
