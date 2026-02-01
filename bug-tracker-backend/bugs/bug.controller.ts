import type { Request, Response } from "express";
import { createIssueSchema, assignIssueSchema } from "../bugs/bug.schema.js";
import {
    createIssue, assignIssue, getProjectIssues, getMyAssignedIssues, addLabelToIssue
    , createLabel, removeLabelFromIssue, getIssueLabels, updateIssueStatus
} from "../bugs/bug.service.js";

export const createIssueController = async (req: Request, res: Response) => {
    const parsed = createIssueSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const projectId = req.params.projectId as string;
    const reporterId = req.user!.id; // auth middleware already sets this

    const issue = await createIssue({
        projectId,
        reporterId,
        ...parsed.data,
    });

    res.status(201).json(issue);
};

export const assignIssueController = async (req: Request, res: Response, next: Function) => {
    try {
        const { issueId } = req.params as { issueId: string };
        const { assigneeId } = assignIssueSchema.parse(req.body);

        const issue = await assignIssue({
            issueId,
            assigneeId,
            requesterId: req.user!.id,
        });

        res.json(issue);
    } catch (err) {
        next(err);
    }
};

// controllers/issue.controller.ts
export const getProjectIssueController = async (req: Request, res: Response, next: Function) => {
    try {
        const { projectId } = req.params as { projectId: string };
        const { page, limit, status, priority, assigneeId } = req.query as { page: string; limit: string; status: string; priority: string; assigneeId: string };

        const issues = await getProjectIssues({
            projectId,
            userId: req.user.id,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            status,
            priority,
            assigneeId,
        });

        res.json(issues);
    } catch (err) {
        next(err);
    }
};

// controllers/issue.controller.ts
export const getMyAssignedIssuesController = async (req: Request, res: Response, next: Function) => {
    try {
        const { page, limit, status, priority } = req.query as { page: string; limit: string; status: string; priority: string };

        const data = await getMyAssignedIssues({
            userId: req.user.id,
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            status,
            priority,
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const createLabelController = async (req: Request, res: Response, next: Function) => {
    try {
        const label = await createLabel(req.user, req.body);
        res.status(201).json(label);
    } catch (err) {
        next(err);
    }
};

export const addLabelToIssueController = async (req: Request, res: Response, next: Function) => {
    try {
        const { issueId, labelId } = req.params as { issueId: string; labelId: string };
        const userId = req.user.id;

        const result = await addLabelToIssue(userId, issueId, labelId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};


export const removeLabelFromIssueController = async (req: Request, res: Response, next: Function) => {
    try {
        const { issueId } = req.params as { issueId: string };
        const { labelId } = req.body as { labelId: string };

        await removeLabelFromIssue(
            issueId,
            labelId,
            req.user.id
        );

        res.status(200).json({
            message: "Label removed from issue",
        });
        console.log("Label removed from issue");
    } catch (err) {
        next(err);
    }
};

export const getIssueLabelsController = async (req: Request, res: Response, next: Function) => {
    try {
        const { issueId } = req.params as { issueId: string };
        const labels = await getIssueLabels(issueId);
        res.json(labels);
    } catch (err) {
        next(err);
    }
};

export const updateIssueStatusController = async (req: Request, res: Response, next: Function) => {
    const { issueId } = req.params as { issueId: string };
    const { status } = req.body as { status: "OPEN" | "IN_PROGRESS" | "CLOSED" };
    const userId = req.user.id;

    try {
        const updatedIssue = await updateIssueStatus(userId, issueId, status);
        res.json(updatedIssue);
    } catch (err: any) {
        next(err);
    }
};
