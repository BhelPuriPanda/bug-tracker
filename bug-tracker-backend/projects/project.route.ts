import { Router } from "express";
import * as controller from "./project.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, controller.createProject);
router.get("/", requireAuth, controller.getProjects);
router.get("/:projectId", requireAuth, controller.getProject);
router.patch("/:projectId", requireAuth, controller.updateProject);
router.delete("/:projectId", requireAuth, controller.deleteProject);

export default router;
