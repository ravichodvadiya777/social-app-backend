import { Request, Response } from "express";
// import Post from "../model/postModel";
import postHelper from "../db/postHelper";
import {Types} from "mongoose";



// Post edit field
const postFieldName: string[] = [
    "title",
    "description",
    "photos"
]




// ========================================================== Start Post Flow ==========================================================
export async function createPost(req:Request, res:Response){
    try {
        const {title, description, photos} = req.body
        if(!req.user){
            return global.sendResponse(res, 403, false, "Not authorized to access this route.");
        }
        const obj = {
            user : req.user._id,
            title : title,
            description : description,
            photos : photos
        }
        const post = await postHelper.insertOne(obj);
        return global.sendResponse(res, 201, true, "Post create successfully.", post);
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

export async function editPost(req:Request, res:Response){
    try {
        const postId = req.params.id
        if(!res.record?.user || !req.user?._id){
            return global.sendResponse(res, 403, false, "Not authorized to access this route.");
        }
        if(res.record?.user.toString() !== req.user._id.toString()){
            return global.sendResponse(res, 403, false, "Not authorized to access this route.");
        }
        
        postFieldName.forEach((field) => {
            if (req.body[field] != null && res.record) res.record[field] = req.body[field];
        });
        
        
        // await Post.updateOne({ _id: postId }, res.record, { new: true })
        await postHelper.updateOne({ _id : postId },res.record);
        return global.sendResponse(res, 200, true,"Edit success!");
        
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

export async function deletePost(req:Request, res:Response){
    try {
        const postId = req.params.id
        if(res.record?.user && req.user){
            if(res.record.user.toString() !== req.user._id.toString()){
                return global.sendResponse(res, 403, false, "Not authorized to access this route.");
            }
        }
        // await Post.findByIdAndDelete(postId);
        await postHelper.delete({_id :  new Types.ObjectId(postId)});
        return global.sendResponse(res, 200,true,'Deleted Successfully');  
        
    } catch (error) {
        console.log(error);
        return global.sendResponse(res, 400, false, "Something not right, please try again.");   
    }
}

// ========================================================== End Post Flow ==========================================================

