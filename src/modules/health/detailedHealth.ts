import { Request, Response } from "express";
import prisma from "../../prismaClient/client";

export const detailedSeverHealthInfo = async (req: Request, res: Response) => {

    const healthcheck = {
        message: "OK",
        uptime: process.uptime(),
        timeStamp: new Date().toISOString(),
        services: {
            database: "unknown"
        }
    }

    try {
        // Prisma DB check
        await prisma.$queryRaw`SELECT 1`;
        healthcheck.services.database = "connected";

        res.status(200).json(healthcheck);
    } catch (error: any) {
        healthcheck.services.database = "disconnected";
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
}