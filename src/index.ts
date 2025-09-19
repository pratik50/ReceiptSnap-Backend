import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import fileRouter from './routes/file';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/auth", authRouter);

app.use("/api/files", fileRouter);

// Serve static files
app.use('/pdfjs', express.static("public/pdfjs"));
app.use('/build', express.static("public/build"));

app.get("/", (req, res) => {
    res.send("✅ Your server is running here!");
});

const PORT = 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on your ip on port:${PORT}`);
});