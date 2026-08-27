import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Worker } from "bullmq";
import { connectDB } from "../db/index.js";
import { Blog } from "../models/blog.model.js";
import { cloudinary } from "../utils/cloudinary.js";

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" };

const createPdf = (blog, filePath) => new Promise((resolve, reject) => {
    const document = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    document.pipe(stream);
    document.fontSize(22).text(blog.title);
    if (blog.description) document.moveDown().fontSize(12).fillColor("#555").text(blog.description);
    document.moveDown().fillColor("#111").fontSize(11).text(blog.content);
    document.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
});

await connectDB();

new Worker("blog-pdf", async (job) => {
    const blog = await Blog.findById(job.data.blogId);
    if (!blog || blog.contentVersion !== job.data.version) return;

    blog.pdfStatus = "PROCESSING";
    await blog.save({ validateBeforeSave: false });

    const filePath = path.resolve("public/temp", `blog-${blog._id}-${job.data.version}.pdf`);
    try {
        await createPdf(blog, filePath);
        const uploaded = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "bookhub/blogs",
        });
        if (blog.pdf.publicId) await cloudinary.uploader.destroy(blog.pdf.publicId, { resource_type: "raw" });
        blog.pdf = { url: uploaded.secure_url, publicId: uploaded.public_id };
        blog.generatedVersion = job.data.version;
        blog.pdfStatus = "READY";
        await blog.save({ validateBeforeSave: false });
    } catch (error) {
        blog.pdfStatus = "FAILED";
        await blog.save({ validateBeforeSave: false });
        throw error;
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}, { connection });
