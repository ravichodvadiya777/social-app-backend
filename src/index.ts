import "./helper/sendResponse"
import express, {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import router from "./routes";
const app:Express = express();
const port = process.env.PORT || 3001;





// config & db
import connectDB from "./db/db";
connectDB(); 

app.use(express.json());
app.use(router)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});