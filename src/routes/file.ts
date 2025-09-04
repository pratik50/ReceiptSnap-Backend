import express from "express";
import { upload } from "../utils/multer";
import { AuthMiddleware } from "../middlewares/auth";
import { deleteFile } from "../modules/file/deleteFile";
import { uploadFile } from "../modules/file/uploadFile";
import { getAllFiles } from "../modules/file/getAllFiles";
import { getAllFolders } from "../modules/file/getAllFolders";

const fileRouter = express.Router();

fileRouter.post("/upload", AuthMiddleware, upload.single("file"), uploadFile);
fileRouter.get("/getAllFiles", AuthMiddleware, getAllFiles);
fileRouter.delete("/:id", AuthMiddleware, deleteFile);
fileRouter.get("/getAllFolders", AuthMiddleware, getAllFolders);

export default fileRouter