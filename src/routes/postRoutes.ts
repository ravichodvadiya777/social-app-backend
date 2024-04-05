import { Router } from "express";

// import controller
import { createPost, editPost, deletePost, getPostById, getAllPost, getPostByUserId} from "../controller/postController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import {getRecord} from "../middleware/getRecord";

import Post from "../model/postModel";

import Schema from "../validationSchema/postSchema";

import {validationSchema} from "../middleware/validation";


const router:Router = Router()

// Post Routes
router.post('/', authenticateToken, auth(["user"]), createPost);
router.get('/', authenticateToken, auth(["user"]), getAllPost);
router.get('/:id', Schema.getPostById, validationSchema, authenticateToken, auth(["user"]), getRecord(Post), getPostById);
router.get('/user/:id', Schema.getPostByUserId, validationSchema, authenticateToken, auth(["user"]), getPostByUserId);
router.patch('/:id', Schema.editPost, validationSchema, authenticateToken, auth(["user"]), getRecord(Post), editPost);
router.delete('/:id', Schema.deletePost, validationSchema, authenticateToken, auth(["user"]), getRecord(Post), deletePost);

export default router