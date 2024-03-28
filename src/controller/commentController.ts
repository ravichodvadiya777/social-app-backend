import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import {Types} from "mongoose";
import {CommentType} from "../model/commentModel";
import {LikeType} from "../model/likeModel";
import likeHelper from "../db/likeHelper";



// ========================================================== Start Comment Flow ==========================================================
// create a new commet
export async function addComment(req:Request, res:Response){
    try {
        const {postId, description} = req.body;
        const obj: CommentType = {
            user : new Types.ObjectId(req.user._id),
            postId : new Types.ObjectId(postId),
            description : description
        }
        const comment = await commentHelper.insertOne(obj);
        return global.sendResponse(res, 201, true, "Comment add successfully.", comment);
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}


// comment like
export async function addLike(req:Request, res:Response){
    try {
        const {postId, type, commentId } = req.body;
        const obj: LikeType = {
            user : new Types.ObjectId(req.user._id),
            postId : new Types.ObjectId(postId),
            itemId : commentId ? new Types.ObjectId(commentId) : new Types.ObjectId(postId),
            type : type // 1:post , 2:comment, 3:story
        }

        const checkLike = await likeHelper.findOne(obj);
        if(checkLike){
            return global.sendResponse(res, 409, false, "Already liked.");
        }
        if(commentId){
            const comment = await commentHelper.findOne({_id : commentId});
            // check comment in postId
            if(comment.postId.toString() !== postId ){
                return  global.sendResponse(res, 406, false,"This is not belong to this post.")
            }
        }
        const like = await likeHelper.insertOne(obj);
        return global.sendResponse(res, 201, true, "Liked Successfully", like);

    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}



// ========================================================== End Comemnt Flow ==========================================================

