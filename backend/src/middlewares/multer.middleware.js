import multer from "multer";
import path from "path";
import fs from "fs";

// Create temp upload folder if it doesn't exist
const uploadPath = "./public/temp";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// Factory Function
const createUploader = (allowedMimeTypes, maxSize) => {
    return multer({
        storage,

        fileFilter(req, file, cb) {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(
                    new Error(
                        `Invalid file type. Allowed: ${allowedMimeTypes.join(", ")}`
                    ),
                    false
                );
            }
        },

        limits: {
            fileSize: maxSize,
        },
    });
};

// Image uploader
export const uploadImage = createUploader(
    [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ],
    5 * 1024 * 1024 // 5 MB
);

// PDF uploader
export const uploadPDF = createUploader(
    ["application/pdf"],
    20 * 1024 * 1024 // 20 MB
);