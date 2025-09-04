import { Request, Response } from "express";
import prisma from "../../prismaClient/client";

interface AuthRequest extends Request {
    userId: string
}

export const getAllFolders = async (req: Request, res: Response) => {
    const { userId } = req as AuthRequest;

    try {
        const folders = await prisma.folders.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ folders, files: [] });

    } catch (err) {
        console.error("Folders fetching error:", err);
        res.status(500).json({ message: "Could not load folders" });
    }
}