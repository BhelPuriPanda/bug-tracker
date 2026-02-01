import { Router } from "express";
import { createLabelController, addLabelToIssueController, removeLabelFromIssueController, getIssueLabelsController } from "../bugs/bug.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", requireAuth, createLabelController);
router.get("/issues/:issueId", requireAuth, getIssueLabelsController);
router.post("/issues/:issueId/:labelId", requireAuth, addLabelToIssueController);
router.delete("/issues/:issueId/:labelId", requireAuth, removeLabelFromIssueController);

export default router;