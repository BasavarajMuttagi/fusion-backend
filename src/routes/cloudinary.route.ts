import express from "express";
import {
  GetAllObjects,
  GetSignature,
} from "../controllers/cloudinary.controller";

const CloudinaryRouter = express.Router();

CloudinaryRouter.get("/signature", GetSignature);
CloudinaryRouter.get("/get-uploads/:resource_type", GetAllObjects);
export default CloudinaryRouter;
