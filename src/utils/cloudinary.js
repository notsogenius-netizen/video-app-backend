import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Execption in uploading file to cloudinary");
    return null;
  }
};

const removeFromCloudinary = async (cloudinaryPath) => {
  try {
    if (!cloudinaryPath) return null;

    const response = await cloudinary.uploader.destroy(cloudinaryPath);

    return response;
  } catch (error) {
    console.log("Execption in removing file from cloudinary");
    return null;
  }
};

export { uploadOnCloudinary, removeFromCloudinary };
