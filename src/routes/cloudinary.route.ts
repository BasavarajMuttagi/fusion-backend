import express from "express";
import {
  DeleteAssetById,
  GetAssetsByResourceType,
  GetSignature,
  HandleNotifications,
} from "../controllers/cloudinary.controller";
import { validateToken } from "../middlewares/auth.middleware";

const CloudinaryRouter = express.Router();

CloudinaryRouter.post("/signature", validateToken, GetSignature);
CloudinaryRouter.get(
  "/getassets/:resource_type",
  validateToken,
  GetAssetsByResourceType,
);
CloudinaryRouter.post("/webhook", HandleNotifications);
CloudinaryRouter.get("/delete/:id", validateToken, DeleteAssetById);
export default CloudinaryRouter;
