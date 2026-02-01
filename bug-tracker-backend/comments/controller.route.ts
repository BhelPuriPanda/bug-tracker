import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    addCommentController,
    getCommentsController,
    deleteCommentController,
} from "./comment.controller.js";

const router = express.Router();

router.post("/issues/:issueId/comments", requireAuth, addCommentController);
router.get("/issues/:issueId/comments", requireAuth, getCommentsController);
router.delete("/comments/:commentId", requireAuth, deleteCommentController);

export default router;
