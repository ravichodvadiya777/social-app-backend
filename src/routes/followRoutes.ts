import { Router } from "express";

// import controller
import {
  follow,
  unfollow,
  followersList,
  followingList,
  suggestedFriends,
} from "../controller/followController";

import { authenticateToken, auth } from "../middleware/verifyToken";

import Schema from "../validationSchema/followSchema";

import { validationSchema } from "../middleware/validation";

const router: Router = Router();

// Follow Routes
router.post(
  "/follow",
  Schema.follow,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  follow
);
router.post(
  "/unfollow",
  Schema.unfollow,
  validationSchema,
  authenticateToken,
  auth(["user"]),
  unfollow
);
router.get("/:id/followers", authenticateToken, auth(["user"]), followersList);
router.get("/:id/following", authenticateToken, auth(["user"]), followingList);
router.get(
  "/suggestedFriends",
  authenticateToken,
  auth(["user"]),
  suggestedFriends
);

export default router;
