import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../prisma/client.js";

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const header = req.headers.authorization;

        if (!header) throw new Error("No token");

        const token = header.split(" ")[1];

        if (!token) throw new Error("No token");

        const payload = verifyToken(token) as any;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: "Unauthorized" });
    }
}
