import { Router } from "express";

// import controller
import { addUser, login, verifyToken, getUserProfile, editUserProfile, fileUpload} from "../controller/userController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import Schema from "../validationSchema/userSchema"


const router:Router = Router()

// Authentication  Routes
router.post('/add', Schema.addUser, addUser);
router.post('/login', Schema.login, login);
router.post('/verifyToken', authenticateToken, auth(["user"]), verifyToken);

// Profile Routes
router.get('/', authenticateToken, auth(["user"]), getUserProfile);
router.patch('/editUserProfile/:id', Schema.editUserProfile, authenticateToken, auth(["user"]), editUserProfile);
router.post('/', authenticateToken, auth(["user"]), fileUpload);

export default router