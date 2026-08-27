import { Queue } from "bullmq";

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" };

export const blogPdfQueue = new Queue("blog-pdf", { connection });

export const queueBlogPdf = (blogId, version) =>
    blogPdfQueue.add(
        "generate-pdf",
        { blogId: blogId.toString(), version },
        { removeOnComplete: 50, removeOnFail: 50 }
    );
