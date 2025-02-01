import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadMedia = async (file_path) => {
  try {
    const result = await cloudinary.uploader.upload(file_path, {
      resource_type: "auto",
    });

    fs.unlinkSync(file_path);

    return result;
  } catch (error) {
    fs.unlinkSync(file_path);
    console.log("error", error);
  }
};

export const deleteCloudinaryMedia = async (public_Id) => {
  try {
    await cloudinary.uploader.destroy(public_Id, (result) => {});
  } catch (error) {
    console.log("error", error);
  }
};
