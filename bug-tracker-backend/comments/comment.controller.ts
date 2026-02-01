import { addComment, getCommentsForIssue, deleteComment } from "./comment.service.js";
import type { Request, Response } from "express";

export const addCommentController = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { issueId } = req.params as { issueId: string };
    const { content } = req.body as { content: string };

    try {
        const comment = await addComment(userId, issueId, content);
        res.status(201).json(comment);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getCommentsController = async (req: Request, res: Response) => {
    const { issueId } = req.params as { issueId: string };
    const comments = await getCommentsForIssue(issueId);
    res.json(comments);
};

export const deleteCommentController = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { commentId } = req.params as { commentId: string };

    try {
        await deleteComment(userId, commentId);
        res.json({ message: "Comment deleted" });
    } catch (err: any) {
        res.status(403).json({ message: err.message });
    }
};
