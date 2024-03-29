import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import {Types} from "mongoose";
import {CommentType} from "../model/commentModel";
import {validationResult} from "express-validator";



// ========================================================== Start Comment Flow ==========================================================
// create a new commet
export async function addComment(req:Request, res:Response){
    const errors = validationResult(req);

    // check for param errors
    if (!errors.isEmpty()) {
        return global.sendResponse(res, 400, false, "Required params not found.", {
            errors: errors.array(),
          });
    }
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



// ========================================================== End Comemnt Flow ==========================================================

