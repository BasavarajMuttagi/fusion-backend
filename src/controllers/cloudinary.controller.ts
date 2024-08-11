import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../..";
import prisma from "../../prisma/db";
import { DeleteNotification, UploadNotification } from "../types";

const GetSignature = async (req: Request, res: Response) => {
  try {
    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);

    const params = {
      timestamp: timestamp,
    };

    // Generate the signature
    const signature = cloudinary.utils.api_sign_request(
      params,
      cloudinary.config().api_secret!,
    );

    return res.status(200).send({ signature, timestamp });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error Occurred, Please Try Again!", error });
  }
};

const GetAllObjects = async (req: Request, res: Response) => {
  try {
    const resource_type = req.params.resource_type;
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type,
      max_results: 5,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

const HandleNotifications = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    switch (payload.notification_type) {
      case "upload":
        await handleNewUpload(payload);
        break;
      case "delete":
        console.log(payload);
        await handleDelete(payload);
        break;
      default:
        console.log("Unhandled notification type:", payload.notification_type);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export { GetSignature, GetAllObjects, HandleNotifications };

const handleDelete = async (payload: DeleteNotification) => {
  const assetIdsToDelete = payload.resources.map(
    (resource) => resource.asset_id,
  );
  console.log("assetIdsToDelete", assetIdsToDelete);
  try {
    await prisma.cloudinaryAsset.deleteMany({
      where: {
        assetId: {
          in: assetIdsToDelete,
        },
      },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

const handleNewUpload = async (payload: UploadNotification) => {
  await prisma.cloudinaryAsset.create({
    data: {
      assetId: payload.asset_id,
      publicId: payload.public_id,
      resourceType: payload.resource_type,
      format: payload.format,
      width: payload.width,
      height: payload.height,
      bytes: payload.bytes,
      url: payload.url,
      secureUrl: payload.secure_url,
      createdAt: payload.created_at,
      updatedAt: payload.created_at,
      tags: payload.tags,
      duration: payload.duration,
      frameRate: payload.frame_rate,
      bitRate: payload.bit_rate,
      playbackUrl: payload.playback_url,
    },
  });
};
