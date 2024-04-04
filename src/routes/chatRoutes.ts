import { Router } from "express";

// import controller
import {chatList, chatMessage} from "../controller/chatController";

import {authenticateToken, auth} from "../middleware/verifyToken";


const router:Router = Router()

// Chat Routes

// get chat list
router.get("/", authenticateToken, auth(["user"]), chatList);

router.get("/chatMessage", authenticateToken, auth(["user"]), chatMessage);


export default router