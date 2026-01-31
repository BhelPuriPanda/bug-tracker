import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function signToken(userId: string) {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
}
