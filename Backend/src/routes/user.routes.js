import { Router } from "express";
import { getCurrentUser } from "../middlewares/auth.middleware";
import * as userController from "../controllers/user.controller.js";


const userRouter = Router();


userRouter.get("/get-me",getCurrentUser("refresh"),userController.getMe)