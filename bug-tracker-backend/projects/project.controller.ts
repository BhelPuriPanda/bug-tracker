import type { Request, Response } from "express";
import * as projectService from "./project.service.js";
import { createProjectSchema, updateProjectSchema } from "./project.schema.js";

export const createProject = async (req: Request, res: Response) => {
    const data = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(req.user.id, data);
    res.status(201).json(project);
};

export const getProjects = async (req: Request, res: Response) => {
    const projects = await projectService.getUserProjects(req.user.id);
    res.json(projects);
};

export const getProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    if (!projectId || typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid projectId" });
    }
    const project = await projectService.getProjectById(
        projectId,
        req.user.id
    );
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
};

export const updateProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    if (!projectId || typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid projectId" });
    }
    const data = updateProjectSchema.parse(req.body);
    await projectService.updateProject(projectId, req.user.id, data);
    res.json({ success: true });
};

export const deleteProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;

    if (!projectId || typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid projectId" });
    }
    await projectService.deleteProject(projectId, req.user.id);
    res.status(204).send();
};


