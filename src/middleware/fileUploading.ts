import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "fs";
import * as path from "path";
import { compressImage, compressVideo } from "../helper/fileCompress";

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

    if (file.mimetype.split("/")[0] == "image") {
      // image compress
      const rendomNumber = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const newFilename = rendomNumber + ".jpg";
      const outputFile = path.join(path.dirname(filename), newFilename);
      const inputFile = filename;
      const fileData = await compressImage(inputFile, outputFile);
      return fileData.url;
    } else {
      // video compress
      const rendomNumber = Math.floor(
        10000000 + Math.random() * 90000000
      ).toString();
      const newFilename = rendomNumber + ".mp4";
      const outputFile = path.join(path.dirname(filename), newFilename);
      const inputFile = filename;
      const fileData = await compressVideo(inputFile, outputFile);
      return fileData;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
