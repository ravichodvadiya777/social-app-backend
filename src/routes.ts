import express from "express";
// import cors from "cors";
const router = express.Router();

import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import followRouter from "./routes/followRoutes";
import commentRouter from "./routes/commentRoutes";
import likeRouter from "./routes/likeRoutes";
import chatRouter from "./routes/chatRoutes";
import { refreshToken } from "./middleware/verifyToken";
import storyRouter from "./routes/storyRoutes";
import notificationRouter from "./routes/notificationRoutes";
import settingRouter from "./routes/settingRoutes";

router.get("/refresh_token", async (req, res) => {
  const token = req.cookies["App"];

  if (token) {
    refreshToken(token, res);
  } else {
    global.sendResponse(res, 400, false, "Your session expired, try to login.", { key: "logout" });
  }
});

router.use("/chat", chatRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/follow", followRouter);
router.use("/comment", commentRouter);
router.use("/like", likeRouter);
router.use("/story", storyRouter);
router.use("/notification", notificationRouter);
router.use("/setting", settingRouter);

export default router;
