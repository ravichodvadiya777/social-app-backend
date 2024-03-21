import express from "express";
// import cors from "cors";
const router = express.Router();

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";

router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
