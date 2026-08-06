import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { getCurrentUser } from "../middlewares/auth.middleware.js"
import { optional } from "zod";

const authRouter = Router();


authRouter.post("/signup", authController.registerUser);
authRouter.post("/login", getCurrentUser({ optionalAuth:true }),authController.verifyUser);
authRouter.post("/logout", getCurrentUser({type:"refresh"}), authController.logout); //private route
authRouter.post("/refresh", getCurrentUser({type:"refresh"}), authController.refresh)  // private route


export { authRouter };
