import { Router } from "express";

// import controller
import { addUser, login, verifyToken} from "../controller/userController";

// import model
// import User from "../model/userModel";


const router:Router = Router()


router.post('/add', addUser);
router.post('/login', login);
router.post('/verifyToken', verifyToken);

export default router