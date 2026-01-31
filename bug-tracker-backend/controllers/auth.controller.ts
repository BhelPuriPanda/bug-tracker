import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function register(req: Request, res: Response) {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
    const result = await authService.loginUser(
        req.body.email,
        req.body.password
    );
    res.json(result);
}

export async function me(req: Request, res: Response) {
    res.json({ user: req.user });
}
