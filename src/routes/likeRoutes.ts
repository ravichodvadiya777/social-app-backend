import { Router } from "express";

// import controller
import { addLike, unlike, getLikeById } from "../controller/likeController";

import { authenticateToken, auth } from "../middleware/verifyToken";

import Schema from "../validationSchema/likeSchema";

import { validationSchema } from "../middleware/validation";

// import {getRecord} from "../middleware/getRecord";

// import Like from "../model/likeModel";

// import Post from "../model/postModel";

const router: Router = Router();

router.post(
  "/",
  Schema.addLike,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  addLike
);
router.delete(
  "/:id",
  Schema.unlike,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  unlike
);
router.get(
  "/:id",
  Schema.getLikeById,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  getLikeById
);

export default router;
