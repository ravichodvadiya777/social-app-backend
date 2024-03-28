import { Router } from "express";

// import controller
import {addComment,addLike} from "../controller/commentController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import {getRecord} from "../middleware/getRecord";

import Comment from "../model/commentModel";

import Post from "../model/postModel";

const router:Router = Router()



// Comment Routes
router.post("/addComment", authenticateToken, auth(["user"]), addComment);
router.post("/addLike", authenticateToken, auth(["user"]), addLike);

export default router