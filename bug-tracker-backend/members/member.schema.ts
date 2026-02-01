import { z } from "zod";

export const addMemberSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(["MAINTAINER", "CONTRIBUTOR", "VIEWER"]),
});

export const projectIdSchema = z.string().uuid();
