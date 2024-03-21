import { Request, Response } from "express";
import User from "../model/userModel";
import RefreshToken from "../model/refreshTokensModel";
import {fileUploading} from "../middleware/fileUploading";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const fieldNames: string[] = [
    "name",
    "dob",
    "email"
]

// ========================================================== Start User Authentication Flow ==========================================================
export async function addUser(req:Request, res:Response){
    try {
        const email = req.body.email;
        const checkUser = await User.findOne({email : email});
        if (checkUser) {
            return global.sendResponse(res, 409, false, "Email already in use.");
        }
        req.body.password = await bcrypt.hash(req.body.password || null, 10);
        const addData = await User.create(req.body);
        return global.sendResponse(res, 201, true, "User add successfully.", addData);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function login(req:Request, res:Response) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email : email}).select("+password");
        if (!user) {
            return global.sendResponse(res, 404, false, "Invalid email");
        } else if (!await bcrypt.compare(password, user.password)) {
            return global.sendResponse(res, 401, false, "Incorrect password");
        } else {
            const accessToken: string = await user.generateAuthToken(process.env.JWT_EXPIRE_IN); // 5 mini
            const refreshToken: string = await user.generateAuthToken(); // main
            if(user._doc){
                user._doc.accessToken = accessToken;
            }
            await RefreshToken.create({
                token : refreshToken,
                user : user._id
            });
            return global.sendResponse(res, 200, true, "Login successfully", user);
        }
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function verifyToken(req:Request, res:Response){
    try {
        const token: string = req.body.token
        if(!token){
            return global.sendResponse(res, 401, false, "No token provided.");
        } 
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        return global.sendResponse(res, 200, true, "Ok.");
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 498, false, "Invalid token. Please try logging in again.",{key : "logout"});
    }
}
// ========================================================== End User Authentication Flow ==========================================================



// ========================================================== Start User Profile Flow ==========================================================

export async function getUserProfile(req:Request, res:Response){
    try {
        let userId  = req.query.id;
        if(!userId){
            if(req.user){
                userId = req.user._id
            }
        }

        const user = await User.findById(userId);
        return global.sendResponse(res, 200, true, "Get user profile.",user);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function editUserProfile(req:Request, res:Response){
    try {
        const userId = req.params.id;
        if(req.user){
            if(userId !== req.user._id.toString()){
                return global.sendResponse(res, 403, false, "Not authorized to access this route.");
            }
        }
        fieldNames.forEach((field) => {
            if (req.body[field] != null && req.user) req.user[field] = req.body[field];
        });

        await User.updateOne({ _id: userId }, res.record, { new: true }).then(()=>{
            return global.sendResponse(res, 200, true,"Edit success!");
        }).catch((err)=>console.log(err)); 
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function fileUpload(req:Request, res:Response){
    try {
        const photos:object | object[] | undefined = req.files ? req.files.file : undefined;
        const url: string[] = [];
        if (Array.isArray(photos)) {
            for(const file of photos){
                const path = await fileUploading(file);
                url.push(path as string);
            }
        } 
        return global.sendResponse(res, 200, true,"File upload success!",url);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

// ========================================================== End User Profile Flow ==========================================================

