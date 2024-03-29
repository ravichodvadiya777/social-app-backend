import { Router } from "express";

// import controller
import {addLike} from "../controller/likeController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import Schema from "../validationSchema/likeSchema"

// import {getRecord} from "../middleware/getRecord";

// import Comment from "../model/commentModel";

// import Post from "../model/postModel";

const router:Router = Router()

router.post("/addLike", Schema.addLike, authenticateToken, auth(["user"]), addLike);

export default router