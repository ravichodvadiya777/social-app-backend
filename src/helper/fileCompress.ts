import * as fs from "fs";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath.path);

// Image Compress
export const compressImage = async (inputFile, outputFile) => {
  try {
    await sharp(inputFile).jpeg({ quality: 70 }).toFile(outputFile);

    const data = await cloudinary.uploader.upload(outputFile);
    // Delete local file after uploading to Cloudinary
    fs.unlinkSync(outputFile);
    fs.unlinkSync(inputFile);
    return data;
  } catch (e) {
    console.error(e);
  }
};

// Video Compress
export const compressVideo = async (inputFile, outputFile) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFile)
      .outputOptions("-crf 20")
      .output(outputFile)
      .on("end", async () => {
        try {
          const data = await cloudinary.uploader.upload(outputFile, {
            resource_type: "video",
          });
          // Delete local file after uploading to Cloudinary
          fs.unlinkSync(outputFile);
          fs.unlinkSync(inputFile);
          return resolve(data.url);
        } catch (uploadError) {
          console.error("Error during upload to cloudinary:", uploadError);
          return reject(uploadError);
        }
      })
      .on("error", (err) => {
        console.error("Error during compression:", err);
        return reject(err);
      })
      .run();
  });
};
