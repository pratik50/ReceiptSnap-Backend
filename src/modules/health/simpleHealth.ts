import { Request, Response } from "express";

export const simpleSeverHealthInfo = (req: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        message: "👍 Sever is healthy"
    })
}