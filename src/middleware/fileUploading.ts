import { v2 as cloudinary } from "cloudinary";
import  {promises as fs} from 'fs';
import * as path from 'path';



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileUploading = async (file) => {
  console.log(file, "==========");
  try {
    const filename = path.join(
      __dirname,
      "../temp/" +
        Date.now() +
        "_" +
        Math.ceil(Math.random() * 1e8) +
        "." +
        file.mimetype.split("/")[1]
    );
    await fs.writeFile(filename, file.data);
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filename)
            .then(async (data) => {
                if (data) {
                    await fs.unlink(filename);
                    resolve(data.secure_url);
                } else {
                    reject(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
