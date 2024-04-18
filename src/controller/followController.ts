import { Request, Response } from "express";
// import Post from "../model/postModel";
import followHelper from "../db/followHelper";
import {Types} from "mongoose";
import {FollowType} from "../model/followModel";

type OptionType = {
    page : number,
    sizePerPage : number,
    sort : string,
    order : string
}



// ========================================================== Start follow Flow ==========================================================
// follow
export async function follow(req:Request, res:Response){
    try {
        const userId = new Types.ObjectId(req.user._id);
        const followId = new Types.ObjectId(req.body.follow);

        const obj:FollowType = {
            user: userId,
            follow: followId,
        };
        const alreadyFollow = await followHelper.findOne(obj);
        if(alreadyFollow) {return global.sendResponse(res, 409, false, "Already Followed")}
        
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
        await followHelper.deleteOne(obj);
        
        return global.sendResponse(res, 200, true, "Unfollow successfully.");
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

// followers list
export async function followersList(req:Request, res:Response){
    try {
        const userId = new Types.ObjectId(req.user._id)
        const friendId = new Types.ObjectId(req.params.id);
        const options: OptionType = {
            page : Number(req.query.page),
            sizePerPage : Number(req.query.sizePerPage),
            sort : req.query.sort.toString(),
            order : req.query.order.toString()
        }
        const page = options?.page || 0;
        const limit = options?.sizePerPage || 10;
        const column_name = options?.sort || "_id";
        const OrderBy = options?.order == "ASC" ? 1 : -1;
        const startIndex = page * limit;
        const sortData = options ? { [column_name]: OrderBy } : 0;
        
        const followers = await followHelper.followersList(friendId, userId, options, sortData, startIndex, limit);
        const pages = Math.ceil(followers[0].totalRecord / limit);
        const hasNextPage = Number(page) < pages - 1;
        const hasPreviousPage = Number(page) > 0;
        return global.sendResponse(res, 200, true, "Get followers successfully.",{followers : followers[0].data, hasNextPage, hasPreviousPage});
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}


// following list
export async function followingList(req:Request, res:Response){
    try {
        const userId = new Types.ObjectId(req.user._id)
        const friendId = new Types.ObjectId(req.params.id);
        const options: OptionType = {
            page : Number(req.query.page),
            sizePerPage : Number(req.query.sizePerPage),
            sort : req.query.sort.toString(),
            order : req.query.order.toString()
        }
        const page = options?.page || 0;
        const limit = options?.sizePerPage || 10;
        const column_name = options?.sort || "_id";
        const OrderBy = options?.order == "ASC" ? 1 : -1;
        const startIndex = page * limit;
        const sortData = options ? { [column_name]: OrderBy } : 0;
        
        const following = await followHelper.followingList(friendId, userId, options, sortData, startIndex, limit);
        
        const pages = Math.ceil(following[0].totalRecord / limit);
        const hasNextPage = Number(page) < pages - 1;
        const hasPreviousPage = Number(page) > 0;
        
        return global.sendResponse(res, 200, true, "Get following successfully.",{following : following[0].data, hasNextPage, hasPreviousPage});
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}



// ========================================================== End follow Flow ==========================================================

