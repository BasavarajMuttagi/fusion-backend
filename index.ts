import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./src/routes/auth.route";
import CloudinaryRouter from "./src/routes/cloudinary.route";
import { OAuth2Client } from "google-auth-library";
dotenv.config();
const PORT = process.env.PORT;
export const SECRET_SALT = process.env.SECRET_SALT as string;
export const APP_BASE_URL = process.env.APP_BASE_URL as string;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET = process.env
  .CLOUDINARY_API_SECRET as string;
export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_BASE_URL}/auth/google/callback`,
);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/cloudinary", CloudinaryRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;
