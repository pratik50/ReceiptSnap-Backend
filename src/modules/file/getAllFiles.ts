import { Request, Response } from "express";
import prisma from "../../prismaClient/client";

interface AuthRequest extends Request {
    userId: string
}

export const getAllFiles = async (req: Request, res: Response) => {
    const { userId } = req as AuthRequest;

    try {

        const files = await prisma.file.findMany({
            where: {
                userId,
            }
        });

        res.status(200).json({ files, folders: [] });

    } catch (err) {
        console.error("Files fetching error:", err);
        res.status(500).json({ message: "Could not load files" });
    }
}