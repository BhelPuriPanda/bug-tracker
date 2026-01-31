import { prisma } from "../prisma/client.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existing) {
        throw new Error("Email already exists");
    }

    const hash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hash,
        },
    });

    const token = signToken(user.id);

    return { user, token };
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = signToken(user.id);

    return { user, token };
}
