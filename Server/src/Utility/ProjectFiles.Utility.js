// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import Config from "../Config/Config.js";

cloudinary.config({
  cloud_name: Config.CLOUDINARY.CLOUD_NAME,
  api_key: Config.CLOUDINARY.CLOUD_API_KEY,
  api_secret: Config.CLOUDINARY.CLOUD_API_SECRET,
});

/**
 * Upload file to cloudinary while preserving folder structure
 * @param {string} localFilePath - local path of uploaded file
 * @param {string} projectName - unique project name/ID to namespace files
 * @param {string} originalPath - relative folder path (e.g. "html/index.html")
 */
const uploadOnCloudinary = async (localFilePath, projectName, originalPath) => {
  try {
    if (!localFilePath) return null;

    // Extract folder structure from original path (if any)
    const relativeDir = path.dirname(originalPath); // e.g. "html"
    const filename = path.basename(originalPath); // e.g. "index.html"

    // Final Cloudinary folder path: projectName/html
    const cloudinaryFolder =
      relativeDir && relativeDir !== "."
        ? `${projectName}/${relativeDir}`
        : `${projectName}`;

    // Upload with folder structure
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: cloudinaryFolder,
      public_id: filename, // keep original filename
      overwrite: true, // replace if file already exists
    });

    console.log(
      "✅ Uploaded to Cloudinary:",
      `${cloudinaryFolder}/${filename} -> ${response.secure_url}`
    );

    // remove file from local storage
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // cleanup local file if error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("❌ Error occurred while uploading: ", error);
    return null;
  }
};

export { uploadOnCloudinary };
