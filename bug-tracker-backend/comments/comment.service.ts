import { prisma } from "../prisma/client.js";

// Create comment
export const addComment = async (userId: string, issueId: string, content: string) => {
    // check issue exists
    const issue = await prisma.issue.findUnique({ where: { id: issueId } });
    if (!issue) throw new Error("Issue not found");

    return prisma.comment.create({
        data: {
            content,
            issueId,
            authorId: userId,
        },
    });
};

// Get all comments for an issue
export const getCommentsForIssue = async (issueId: string) => {
    return prisma.comment.findMany({
        where: { issueId },
        include: { author: true },
        orderBy: { createdAt: "asc" },
    });
};

// Delete comment
export const deleteComment = async (userId: string, commentId: string) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { issue: { include: { project: { include: { members: true } } } } },
    });

    if (!comment) throw new Error("Comment not found");

    // check permissions: author or owner/maintainer of project
    const isAuthor = comment.authorId === userId;
    const membership = comment.issue.project.members.find(
        (m) => m.userId === userId && ["OWNER", "MAINTAINER"].includes(m.role)
    );

    if (!isAuthor && !membership) throw new Error("Not authorized to delete comment");

    return prisma.comment.delete({ where: { id: commentId } });
};
