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
            description : description
        }

        if(commentId){
            obj.commentId = new Types.ObjectId(commentId)
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
        const { options } = req.body;
        const page = options?.page || 0;
        const limit = options?.sizePerPage || 10;
        const column_name = options?.sort || "_id";
        const OrderBy = options?.order == "ASC" ? 1 : -1;
        const startIndex = page * limit;
        const sortData = options ? { [column_name]: OrderBy } : 0;

        const comment = await  commentHelper.getCommentByPostId(postId, new Types.ObjectId(req.user._id), options, sortData, startIndex, limit);
        const pages = Math.ceil(comment[0].totalRecord / limit);
        const hasNextPage = Number(page) < pages - 1;
        const hasPreviousPage = Number(page) > 0;
        return global.sendResponse(res, 200, true, "Get comment successfully.", {comment : comment[0].data, hasNextPage, hasPreviousPage});
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

export async function getSubCommentByCommentId(req:Request, res:Response){
  try {
    const commentId = new Types.ObjectId(req.params.id);
    const { options } = req.body;
    const page = options?.page || 0;
    const limit = options?.sizePerPage || 10;
    const column_name = options?.sort || "_id";
    const OrderBy = options?.order == "ASC" ? 1 : -1;
    const startIndex = page * limit;
    const sortData = options ? { [column_name]: OrderBy } : 0;

    const comment = await  commentHelper.getSubCommentByCommentId(commentId, new Types.ObjectId(req.user._id), options, sortData, startIndex, limit);
    const pages = Math.ceil(comment[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;
      
    return global.sendResponse(res, 200, true, "Get comment successfully.", {comment : comment[0].data, hasNextPage, hasPreviousPage});
  } catch (error) {
      console.log(error); 
      return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// ========================================================== End Comemnt Flow ==========================================================

