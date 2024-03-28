import express from "express";
// import cors from "cors";
const router = express.Router();

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import followRouter from "./routes/followRoutes";
import commentRouter from "./routes/commentRoutes";

router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/follow", followRouter);
router.use("/comment", commentRouter);

export default router;
