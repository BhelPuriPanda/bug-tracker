console.log("APP FILE LOADED");

import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./projects/project.route.js";
import issueRoutes from "./bugs/bug.route.js";
import labelRoutes from "./routes/label.route.js";
import statusRoutes from "./routes/status.route.js";
import commentRoutes from "./comments/controller.route.js";

const app = express();

// global middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

// routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", issueRoutes);
app.use("/labels", labelRoutes);
app.use("/", statusRoutes);
app.use("/", commentRoutes);

// TODO: add global error handler here later

export default app;
