import { Router } from "express";
import { createIssueController, assignIssueController, getProjectIssueController, getMyAssignedIssuesController } from "../bugs/bug.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post("/projects/:projectId/issues", requireAuth, createIssueController);
router.patch("/projects/:projectId/issues/:issueId/assign", requireAuth, assignIssueController);
router.get("/projects/:projectId/issues", requireAuth, getProjectIssueController);
router.get("/issues/assigned", requireAuth, getMyAssignedIssuesController);

export default router;
