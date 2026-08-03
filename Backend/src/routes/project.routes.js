import { Router } from "express";
import { getCurrentUser } from "../middlewares/auth.middleware.js";
import projectController from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/projects", getCurrentUser(), projectController.getProject);
projectRouter.get("/projects/:id", getCurrentUser(), projectController.getProject);
projectRouter.post("/projects", getCurrentUser(), projectController.postProject);
projectRouter.delete(
  "/projects/:id",
  getCurrentUser(),
  projectController.deleteProject,
);

export { projectRouter };
