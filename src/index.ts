import "./helper/sendResponse"
import express, {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import router from "./routes";
const app:Express = express();
const port = process.env.PORT || 3001;
import cors from "cors";
import fileUpload from "express-fileupload"

// config & db
import connectDB from "./db/db";
connectDB(); 

app.use(cors());

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(router)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});