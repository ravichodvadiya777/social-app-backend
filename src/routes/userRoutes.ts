import { Router } from "express";

// import controller
import { addUser, login, verifyToken, getUserProfile, editUserProfile, fileUpload} from "../controller/userController";

import {authenticateToken, auth} from "../middleware/verifyToken";


const router:Router = Router()

// Authentication  Routes
router.post('/add', addUser);
router.post('/login', login);
router.post('/verifyToken', authenticateToken, auth(["user"]), verifyToken);

// Profile Routes
router.get('/', authenticateToken, auth(["user"]), getUserProfile);
router.patch('/editUserProfile/:id', authenticateToken, auth(["user"]), editUserProfile);
router.post('/', authenticateToken, auth(["user"]), fileUpload);

export default router