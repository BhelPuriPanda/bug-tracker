import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { updateIssueStatusController } from "../bugs/bug.controller.js";

const router = express.Router();

router.patch("/issues/:issueId/status", requireAuth, updateIssueStatusController);

export default router;