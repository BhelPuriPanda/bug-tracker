import { prisma } from "../prisma/client.js";

export const createIssue = async ({
    projectId,
    reporterId,
    title,
    description,
}: {
    projectId: string;
    reporterId: string;
    title: string;
    description: string;
}) => {
    // ensure user is project member
    const member = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: reporterId,
                projectId,
            },
        },
    });

    if (!member) {
        throw new Error("Not a project member");
    }

    return prisma.issue.create({
        data: {
            title,
            description,
            projectId,
            reporterId,
            status: "OPEN",
        },
    });
};

export const assignIssue = async ({
    issueId,
    assigneeId,
    requesterId,
}: {
    issueId: string;
    assigneeId: string;
    requesterId: string;
}) => {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
    });

    if (!issue) throw new Error("Issue not found");

    // 1️⃣ Check requester role in project
    const requesterMembership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: requesterId,
                projectId: issue.projectId,
            },
        },
    });

    if (
        !requesterMembership ||
        !["OWNER", "MAINTAINER"].includes(requesterMembership.role)
    ) {
        throw new Error("Not allowed to assign issues");
    }

    // 2️⃣ Check assignee is project member
    const assigneeMembership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: assigneeId,
                projectId: issue.projectId,
            },
        },
    });

    if (!assigneeMembership) {
        throw new Error("User is not a project member");
    }

    // 3️⃣ Assign
    return prisma.issue.update({
        where: { id: issueId },
        data: { assigneeId },
    });
};

// services/issue.service.ts
export const getProjectIssues = async ({
    projectId,
    userId,
    page,
    limit,
    status,
    priority,
    assigneeId,
}: {
    projectId: string;
    userId: string;
    page: number;
    limit: number;
    status?: string;
    priority?: string;
    assigneeId?: string;
}) => {
    // 🔐 access check
    const membership = await prisma.projectMember.findFirst({
        where: { projectId, userId },
    });

    if (!membership) {
        throw new Error("Not a project member");
    }

    const where: any = {
        projectId,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId && { assigneeId }),
    };

    const [items, total] = await Promise.all([
        prisma.issue.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                assignee: { select: { id: true, name: true } },
                reporter: { select: { id: true, name: true } },
            },
        }),
        prisma.issue.count({ where }),
    ]);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
    };
};

// services/issue.service.ts
export const getMyAssignedIssues = async ({
    userId,
    page,
    limit,
    status,
    priority,
}: {
    userId: string;
    page: number;
    limit: number;
    status?: string;
    priority?: string;
}) => {
    const where: any = {
        assigneeId: userId,
        ...(status && { status }),
        ...(priority && { priority }),
    };

    const [items, total] = await Promise.all([
        prisma.issue.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                project: { select: { id: true, title: true } },
                reporter: { select: { id: true, name: true } },
            },
        }),
        prisma.issue.count({ where }),
    ]);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
    };
};

export const createLabel = async (user: any, data: any) => {
    if (user.role !== "ADMIN") {
        throw new Error("Only admins can create labels");
    }

    return prisma.label.create({
        data: {
            name: data.name,
            color: data.color,
        },
    });
};

export const addLabelToIssue = async (
    userId: string,
    issueId: string,
    labelId: string
) => {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
    });

    if (!issue) throw new Error("Issue not found");

    // check role in project
    const membership = await prisma.projectMember.findFirst({
        where: {
            userId,
            projectId: issue.projectId,
            role: { in: ["OWNER", "MAINTAINER"] },
        },
    });

    if (!membership) {
        throw new Error("Not allowed to modify labels");
    }

    return prisma.issueLabel.create({
        data: {
            issueId,
            labelId,
        },
    });
};

export const removeLabelFromIssue = async (issueId: string, labelId: string, userId: string) => {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
    });

    if (!issue) throw new Error("Issue not found");

    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId: issue.projectId,
            userId,
            role: { in: ["OWNER", "MAINTAINER"] },
        },
    });

    if (!membership) {
        throw new Error("Not allowed");
    }

    await prisma.issueLabel.delete({
        where: {
            issueId_labelId: { issueId, labelId },
        },
    });
};

export const getIssueLabels = async (issueId: string) => {
    return prisma.issueLabel.findMany({
        where: { issueId },
        include: { label: true },
    });
};

export const updateIssueStatus = async (
    userId: string,
    issueId: string,
    newStatus: "OPEN" | "IN_PROGRESS" | "CLOSED"
) => {
    // 1️⃣ Fetch issue with project & assignee
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: {
            project: true,
            assignee: true,
        },
    });

    if (!issue) throw new Error("Issue not found");

    // 2️⃣ Check permissions
    const membership = await prisma.projectMember.findFirst({
        where: {
            userId,
            projectId: issue.projectId,
        },
    });

    if (!membership && issue.assigneeId !== userId) {
        throw new Error("Not authorized to update this issue");
    }

    const allowedRoles = ["OWNER", "MAINTAINER"];
    const isPrivileged = membership && allowedRoles.includes(membership.role);
    const isAssignee = issue.assigneeId === userId;

    // 3️⃣ Rules
    if (newStatus === "IN_PROGRESS" || newStatus === "CLOSED") {
        if (!isPrivileged && !isAssignee) {
            throw new Error(
                "Only project owner, maintainer, or assignee can update status"
            );
        }
    }

    if (newStatus === "OPEN") {
        // only owner/maintainer can reopen
        if (!isPrivileged) throw new Error("Only owner/maintainer can reopen issue");
    }

    // 4️⃣ Update
    const updated = await prisma.issue.update({
        where: { id: issueId },
        data: { status: newStatus },
    });

    return updated;
};
