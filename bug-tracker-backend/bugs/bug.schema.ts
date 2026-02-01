import { z } from "zod";

export const createIssueSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),
});

export const assignIssueSchema = z.object({
    assigneeId: z.string(),
});

export const createLabelSchema = z.object({
    name: z.string().min(2),
    color: z.string().optional(),
});
