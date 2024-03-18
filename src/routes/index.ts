import { Router } from "express";
import { home, auth } from "../controller";

const router:Router = Router()

router.get('/', home);
router.get('/auth', auth);

export default router