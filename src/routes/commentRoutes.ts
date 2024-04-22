import { Router } from "express";

// import controller
import {
  addComment,
  getCommentByPostId,
  getSubCommentByCommentId,
} from "../controller/commentController";

import { authenticateToken, auth } from "../middleware/verifyToken";

import Schema from "../validationSchema/commentSchema";

import { validationSchema } from "../middleware/validation";

import { getRecord } from "../middleware/getRecord";

// import Comment from "../model/commentModel";

import Post from "../model/postModel";
import Comment from "../model/commentModel";

const router: Router = Router();

// Comment Routes

router.get(
  "/postId/:id",
  Schema.getCommentByPostId,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  getRecord(Post),
  getCommentByPostId
);

router.get(
  "/commentId/:id",
  Schema.getSubCommentByCommentId,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  getRecord(Comment),
  getSubCommentByCommentId
);

router.post(
  "/",
  Schema.addComment,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  addComment
);

export default router;
