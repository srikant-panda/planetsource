import { Router } from "express";
import { getCurrentUser } from "../middlewares/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";


const userRouter = Router();


userRouter.get("/get-me",getCurrentUser(),userController.getMe)

export default userRouter;