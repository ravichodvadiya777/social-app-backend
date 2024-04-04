import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import * as path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileUploading = async (file) => {
  const tempFolderPath = path.resolve(__dirname, "..", "temp");

  // Ensure the temporary folder exists
  try {
    await fs.access(tempFolderPath, fs.constants.F_OK);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir(tempFolderPath, { recursive: true });
    } else {
      throw new Error(`Error accessing temporary folder: ${err.message}`);
    }
  }

  try {
    const filename = path.join(
      tempFolderPath,
      `${Date.now()}_${Math.ceil(Math.random() * 1e8)}.${
        file.mimetype.split("/")[1]
      }`
    );
    await fs.writeFile(filename, file.data);

    const data = await cloudinary.uploader.upload(filename);
    await fs.unlink(filename);

    return data.secure_url;
  } catch (error) {
    console.error(error);
    throw error;
  }
};