import { Router } from "express";

// import controller
import {follow, unfollow} from "../controller/followController";

import {authenticateToken, auth} from "../middleware/verifyToken";


const router:Router = Router()



// Follow Routes
router.post("/follow", authenticateToken, auth(["user"]), follow);
router.post("/unfollow", authenticateToken, auth(["user"]), unfollow);

export default router