import { Request, Response } from "express";
import prisma from "../../prismaClient/client";
import { uploadToS3 } from "../../lib/s3/uploadToS3";

interface AuthRequest extends Request {
    userId: string
}

//Function to upload file
export const uploadFile = async (req: Request, res: Response) => {
    const { file } = req;
    const { userId } = req as AuthRequest;

    if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return
    }

    if (!userId) {
        res.status(400).json({ message: "Invalid or missing userId" });
        return
    }

    try {
        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            res.status(400).json({ message: "Invalid userId: User does not exist" });
            return
        }

        const key = `raw-uploads/${userId}_${file.originalname}`;
        const url = await uploadToS3(file.buffer, key, file.mimetype, false);

        const saved = await prisma.file.create({
            data: {
                name: file.originalname,
                url: url,
                type: file.mimetype,
                size: file.size,
                userId: userId
            }
        });

        res.status(201).json({
            message: "File uploaded successfully",
            file: saved
        });
    } catch (err) {
        console.error("upload error:", err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};