import { z } from "zod";

export const createProjectSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
});
