import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import {Types} from "mongoose";
import {LikeType} from "../model/likeModel";
import likeHelper from "../db/likeHelper";


export async function addLike(req:Request, res:Response){
    try {
        const {postId, type, commentId, subCommentId } = req.body;
        let id: Types.ObjectId;
        switch (type) {
            case 1:
                id = postId
                break;
            case 2:
                id = commentId
                break;
            case 3:
                id = subCommentId
                break;    
            default:
                id = postId
                break;
        }
        const obj: LikeType = {
            user : new Types.ObjectId(req.user._id),
            postId : new Types.ObjectId(postId),
            itemId : id,
            type : type // 1:post , 2:comment, 3:sub-comment
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

export async function unlike(req:Request, res:Response){
    try {
        const tokenUser = res.record.user.toString()
        const oldDataUser = req.user._id.toString()
        
        if(!tokenUser || tokenUser !== oldDataUser){
           return global.sendResponse(res, 401, false, 'Unauthorized User');
        }else{
           await likeHelper.deleteOne({_id : req.params.id, user : req.user._id})
           return global.sendResponse(res, 200, true,'Unliked successfully');
        }  
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

// get like data
export async function getLikeById(req:Request, res:Response){
    try {
        const id = new Types.ObjectId(req.params.id);
        const getLike = await likeHelper.getLikeById(id, new Types.ObjectId(req.user._id));
        return global.sendResponse(res, 200, true,'Get liked successfully', getLike);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}