import { Request, Response } from "express";
import prisma from "../../prismaClient/client";

interface AuthRequest extends Request {
    userId: string
}

export const getFoldersFiles = async (req: Request, res: Response) => {
    const { userId } = req as AuthRequest;
    const folderId = req.params.id;

    try {

        const files = await prisma.file.findMany({
            where: {
                userId,
                folderId
            }
        });

        res.status(200).json({ files, folders: [] });

    } catch (err) {
        console.error("Files fetching error:", err);
        res.status(500).json({ message: "Could not load files" });
    }
}