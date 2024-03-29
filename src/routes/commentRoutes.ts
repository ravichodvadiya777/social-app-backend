import { Router } from "express";

// import controller
import {addComment} from "../controller/commentController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import Schema from "../validationSchema/commentSchema"

import {validationSchema} from "../middleware/validation";

// import {getRecord} from "../middleware/getRecord";

// import Comment from "../model/commentModel";

// import Post from "../model/postModel";

const router:Router = Router()

// Comment Routes
router.post("/addComment", Schema.addComment, validationSchema, authenticateToken, auth(["user"]), addComment);

export default router