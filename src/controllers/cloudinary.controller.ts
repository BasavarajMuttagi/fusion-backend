import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../..";

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

export { GetSignature, GetAllObjects };
