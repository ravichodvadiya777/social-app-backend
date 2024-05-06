import { Router } from "express";
import { auth, authenticateToken } from "../middleware/verifyToken";
import { editSetting, getSetting } from "../controller/settingController";

const router: Router = Router();

router.get("/", authenticateToken, auth(["user"]), getSetting);

router.patch("/", authenticateToken, auth(["user"]), editSetting);

export default router;
