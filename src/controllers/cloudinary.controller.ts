import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../..";
import prisma from "../../prisma/db";
import { DeleteNotification, UploadNotification } from "../types";
import { tokenType } from "../middlewares/auth.middleware";
import { resourceType } from "@prisma/client";

const GetSignature = async (req: Request, res: Response) => {
  const user = req.body.user as tokenType;
  const fileName = req.body.fileName;
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
      upload_preset: "user_uploads",
      public_id: `user_${user.userId}/${fileName}`,
      folder: `user_uploads/${user.userId}`,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      cloudinary.config().api_secret!,
    );

    return res.status(200).send({
      ...params,
      signature,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error Occurred, Please Try Again!", error });
  }
};

const GetAssetsByResourceType = async (req: Request, res: Response) => {
  const resource_type = req.params.resource_type as resourceType;
  const { userId } = req.body.user as tokenType;
  const { starred } = req.query;

  try {
    if (!["image", "video"].includes(resource_type)) {
      return res.status(400).json({ error: "Invalid resource type" });
    }

    const whereConditions: {
      userId: string;
      resourceType: resourceType;
      starred?: boolean;
    } = {
      userId,
      resourceType: resource_type,
    };

    if (starred !== undefined) {
      const isStarred = starred === "true";
      whereConditions.starred = isStarred;
    }

    const assets = await prisma.cloudinaryAsset.findMany({
      where: whereConditions,
    });

    return res.status(200).json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const StarAssetById = async (req: Request, res: Response) => {
  const assetId = req.params.id;
  const { userId } = req.body.user as tokenType;

  try {
    const asset = await prisma.cloudinaryAsset.findUnique({
      where: {
        assetId,
        userId,
      },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const updatedAsset = await prisma.cloudinaryAsset.update({
      where: {
        assetId,
        userId,
      },
      data: {
        starred: !asset.starred,
      },
    });

    return res.status(200).json(updatedAsset);
  } catch (error) {
    console.error("Error starring asset:", error);
    return res.status(500).json({ error: "Internal server error" });
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

const DeleteAssetById = async (req: Request, res: Response) => {
  const assetId = req.params.id;

  try {
    const asset = await prisma.cloudinaryAsset.findUnique({
      where: { assetId },
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await prisma.cloudinaryAsset.delete({
      where: { assetId },
    });

    return res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return res.status(500).json({ error: "Failed to delete asset" });
  }
};

export {
  GetSignature,
  GetAssetsByResourceType,
  HandleNotifications,
  DeleteAssetById,
  StarAssetById,
};

const handleDelete = async (payload: DeleteNotification) => {
  const assetIdsToDelete = payload.resources.map(
    (resource) => resource.asset_id,
  );
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
  console.log(payload);
  const userId = payload.asset_folder.split("/")[1];
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
      userId,
      displayName: payload.display_name,
    },
  });
};
