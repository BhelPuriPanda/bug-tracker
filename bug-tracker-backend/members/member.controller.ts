import type { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { addMemberSchema, projectIdSchema } from "./member.schema.js";

export const addProjectMember = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { userId, role } = addMemberSchema.parse(req.body);
    const requesterId = req.user!.id;

    projectIdSchema.parse(projectId);

    // check requester role
    const requester = await prisma.projectMember.findFirst({
        where: {
            projectId: projectId as string,
            userId: requesterId,
            role: { in: ["OWNER", "MAINTAINER"] },
        },
    });

    if (!requester) {
        return res.status(403).json({ message: "Not allowed" });
    }

    try {
        const member = await prisma.projectMember.create({
            data: {
                projectId: projectId as string,
                userId,
                role,
            },
        });

        res.status(201).json(member);
    } catch {
        res.status(400).json({ message: "User already in project" });
    }
};

export const getProjectMembers = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = req.user!.id;

    projectIdSchema.parse(projectId);

    // must be member
    const access = await prisma.projectMember.findFirst({
        where: { projectId: projectId as string, userId },
    });

    if (!access) {
        return res.status(403).json({ message: "Access denied" });
    }

    const members = await prisma.projectMember.findMany({
        where: { projectId: projectId as string },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    res.json(members);
};
