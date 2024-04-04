import { Router } from "express";

// import controller
import { addUser, login, verifyToken, getUserProfile, editUserProfile, changePassword, chekUserName} from "../controller/userController";

import {authenticateToken, auth} from "../middleware/verifyToken";

import Schema from "../validationSchema/userSchema";

import {validationSchema} from "../middleware/validation";


const router:Router = Router()

// Authentication  Routes
router.post('/', Schema.addUser, addUser);
router.post('/login', Schema.login, login);
router.post('/verifyToken', authenticateToken, auth(["user"]), verifyToken);

// Profile Routes
router.get('/:id', authenticateToken, validationSchema, auth(["user"]), getUserProfile);
router.patch('/changePassword', Schema.changePassword, validationSchema, authenticateToken, auth(["user"]), changePassword);
router.patch('/:id', Schema.editUserProfile, validationSchema, authenticateToken, auth(["user"]), editUserProfile);
router.get('/', Schema.chekUserName, validationSchema, authenticateToken, auth(["user"]), chekUserName);



export default router