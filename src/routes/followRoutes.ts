import { Router } from "express";

// import controller
import {follow, unfollow} from "../controller/followController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import Schema from "../validationSchema/followSchema"


const router:Router = Router()



// Follow Routes
router.post("/follow", Schema.follow, authenticateToken, auth(["user"]), follow);
router.post("/unfollow", Schema.unfollow, authenticateToken, auth(["user"]), unfollow);

export default router