import express from "express";
import {
  GetAllObjects,
  GetSignature,
  HandleNotifications,
} from "../controllers/cloudinary.controller";

const CloudinaryRouter = express.Router();

CloudinaryRouter.get("/signature", GetSignature);
CloudinaryRouter.get("/get-uploads/:resource_type", GetAllObjects);
CloudinaryRouter.post("/webhook", HandleNotifications);
export default CloudinaryRouter;
