import { Router } from "express";
import * as controller from "./project.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { addProjectMember, getProjectMembers } from "../members/member.controller.js";

const router = Router();

router.post("/", requireAuth, controller.createProject);
router.get("/", requireAuth, controller.getProjects);
router.get("/:projectId", requireAuth, controller.getProject);
router.patch("/:projectId", requireAuth, controller.updateProject);
router.delete("/:projectId", requireAuth, controller.deleteProject);
router.post("/:projectId/members", requireAuth, addProjectMember);
router.get("/:projectId/members", requireAuth, getProjectMembers);


export default router;
