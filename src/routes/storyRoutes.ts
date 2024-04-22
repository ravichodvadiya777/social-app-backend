import { Router } from "express";

// import controller
import { createStory, getStory } from "../controller/storyController";

import { authenticateToken, auth } from "../middleware/verifyToken";

const router: Router = Router();

// Post Routes
router.get("/", authenticateToken, auth(["user"]), getStory);
router.post("/", authenticateToken, auth(["user"]), createStory);

export default router;
