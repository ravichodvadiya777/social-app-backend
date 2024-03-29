import { Request, Response } from "express";
// import Post from "../model/postModel";
import followHelper from "../db/followHelper";
import {Types} from "mongoose";
import {FollowType} from "../model/followModel";
import {validationResult} from "express-validator";



// ========================================================== Start follow Flow ==========================================================
// follow
export async function follow(req:Request, res:Response){
    const errors = validationResult(req);

    // check for param errors
    if (!errors.isEmpty()) {
        return global.sendResponse(res, 400, false, "Required params not found.", {
            errors: errors.array(),
        });
    }
    try {
        const userId = new Types.ObjectId(req.user._id);
        const followId = new Types.ObjectId(req.body.follow);

        const obj:FollowType = {
            user: userId,
            follow: followId,
        };
        
        const alreadyFollow = await followHelper.findOne(obj);
        if(alreadyFollow) {return global.sendResponse(res, 409, false, "Already Followed");}
        
        if (userId.equals(followId)) {
            return global.sendResponse(res, 409, false, "You can't follow yourself");
        }
        
        const follow = await followHelper.insertOne(obj);
        
        return global.sendResponse(res, 201, true, "Follow successfully.", follow);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

// unfollow
export async function unfollow(req:Request, res:Response){
    const errors = validationResult(req);

    // check for param errors
    if (!errors.isEmpty()) {
        return global.sendResponse(res, 400, false, "Required params not found.", {
            errors: errors.array(),
        });
    }
    try {
        const userId = new Types.ObjectId(req.user._id);
        const followId = new Types.ObjectId(req.body.follow);

        const obj:FollowType = {
            user: userId,
            follow: followId,
        };
        const unfollow = await followHelper.findOne(obj);
        if(!unfollow){
            return global.sendResponse(res, 409, false, "You can't unfollow");
        }
        await followHelper.delete(obj);
        
        return global.sendResponse(res, 201, true, "Unfollow successfully.");
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

// ========================================================== End follow Flow ==========================================================

