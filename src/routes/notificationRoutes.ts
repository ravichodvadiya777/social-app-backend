import { Router } from "express";
import { getNotification, getNotificationCount } from "../controller/notificationController";
import { auth, authenticateToken } from "../middleware/verifyToken";

const router: Router = Router();

router.get("/", authenticateToken, auth(["user"]), getNotification);

router.get("/count", authenticateToken, auth(["user"]), getNotificationCount);

export default router;
