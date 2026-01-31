import { prisma } from "../prisma/client.js";
import type { CreateProjectInput } from "./project.schema.js";

export const createProject = async (
    userId: string,
    data: CreateProjectInput
) => {
    return prisma.project.create({
        data: {
            title: data.title,
            description: data.description ?? "",
            ownerId: userId,
            members: {
                create: {
                    userId,
                    role: "OWNER",
                },
            },
        },
    });
};

export const getUserProjects = async (userId: string) => {
    return prisma.project.findMany({
        where: {
            members: {
                some: { userId },
            },
        },
    });
};

export const getProjectById = async (
    projectId: string,
    userId: string
) => {
    return prisma.project.findFirst({
        where: {
            id: projectId,
            members: {
                some: { userId },
            },
        },
    });
};

export const updateProject = async (
    projectId: string,
    userId: string,
    data: any
) => {
    return prisma.project.updateMany({
        where: {
            id: projectId,
            ownerId: userId,
        },
        data,
    });
};

export const deleteProject = async (
    projectId: string,
    userId: string
) => {
    return prisma.project.deleteMany({
        where: {
            id: projectId,
            ownerId: userId,
        },
    });
};
