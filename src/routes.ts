import express from "express";
// import cors from "cors";
const router = express.Router();

import userRouter from "./routes/userRoutes";

router.use("/user", userRouter);

export default router;
