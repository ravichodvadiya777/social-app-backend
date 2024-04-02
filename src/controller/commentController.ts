import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import {Types} from "mongoose";
import {CommentType} from "../model/commentModel";




// ========================================================== Start Comment Flow ==========================================================
// create a new commet
export async function addComment(req:Request, res:Response){
    try {
        const {postId, commentId, description} = req.body;
        const obj: CommentType = {
            user : new Types.ObjectId(req.user._id),
            postId : new Types.ObjectId(postId),
            commentId : new Types.ObjectId(commentId),
            description : description
        }
        const comment = await commentHelper.insertOne(obj);
        return global.sendResponse(res, 201, true, "Comment add successfully.", comment);
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function getCommentByPostId(req:Request, res:Response){
    try {
        const postId = new Types.ObjectId(req.params.id);
        const comment = await  commentHelper.getCommentByPostId(postId, new Types.ObjectId(req.user._id));
        return global.sendResponse(res, 200, true, "Get comment successfully.", comment);
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function getSubCommentByCommentId(req:Request, res:Response){
  try {
      const commentId = new Types.ObjectId(req.params.id);
      const comment = await  commentHelper.getSubCommentByCommentId(commentId, new Types.ObjectId(req.user._id));
      
      return global.sendResponse(res, 200, true, "Get comment successfully.", comment);
  } catch (error) {
      console.log(error); 
      return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// ========================================================== End Comemnt Flow ==========================================================

