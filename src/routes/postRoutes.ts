import { Router } from "express";

// import controller
import { createPost, editPost, deletePost} from "../controller/postController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import {getRecord} from "../middleware/getRecord";

import Post from "../model/postModel";

import Schema from "../validationSchema/postSchema";

import {validationSchema} from "../middleware/validation";


const router:Router = Router()

// Post Routes
router.post('/addPost', Schema.createPost, validationSchema, authenticateToken, auth(["user"]), createPost);
router.patch('/editPost/:id', Schema.editPost, validationSchema, authenticateToken, auth(["user"]), getRecord(Post), editPost);
router.delete('/deletePost/:id', Schema.deletePost, validationSchema, authenticateToken, auth(["user"]), getRecord(Post), deletePost);

export default router