import { Request, Response } from "express";
import User from "../model/userModel";
import RefreshToken from "../model/refreshTokensModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ========================================================== Start User Authentication Flow ==========================================================
export async function addUser(req:Request, res:Response){
    try {
        const email = req.body.email;
        const checkUser = await User.findOne({email : email});
        if (checkUser) {
            return res.status(409).send({
                code : 409,
                message : "Email already in use",
            });            
        }
        req.body.password = await bcrypt.hash(req.body.password || null, 10);
        const addData = await User.create(req.body);
        res.status(200).send({
            code : 200,
            message : "User add successfully",
            data : addData
        });
        return;
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            code : 400,
            message : "Something not right, please try again.",
        });
    }
}

export async function login(req:Request, res:Response) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email : email}).select("+password");
        if (!user) {
            return res.status(404).send({
                code : 404,
                message : "Invalid Email",
            });
        } else if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).send({
                code : 401,
                message : "Incorrect Password",
            });
        } else {
            const accessToken: string = await user.generateAuthToken(process.env.JWT_EXPIRE_IN); // 5 mini
            const refreshToken: string = await user.generateAuthToken(); // main
            user._doc.accessToken = accessToken;
            await RefreshToken.create({
                token : refreshToken,
                user : user._id
            });
            return res.status(200).send({
                code : 200,
                message : 'Login Successfully',
                data : user
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            code : 400,
            message : "Something not right, please try again.",
        });
    }
}

export async function verifyToken(req:Request, res:Response){
    try {
        const token: string = req.body.token
        if(!token){
            return res.status(401).send({
                code : 401,
                message : 'No Token Provided'
            })
        } 
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.status(200).send({
            code : 200,
            message : 'ok'
        })
    } catch (error) {
        console.log(error);
        res.status(498).send({
            code : 498,
            message : 'Invalid token. Please try logging in again.',
            data : {key : "logout"}
        })
    }
}
// ========================================================== End User Authentication Flow ==========================================================
