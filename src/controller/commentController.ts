import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import {Types} from "mongoose";
import {CommentType} from "../model/commentModel";
import Comment from "../model/commentModel";




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

export async function getCommentByPostId(req:Request, res:Response){
    try {
        const postId = new Types.ObjectId(req.params.id);
        // const comment = await  commentHelper.find({postId : postId});
        const comment = await Comment.aggregate(
            [
                {
                  '$match': {
                    'postId': postId
                  }
                }, {
                  '$lookup': {
                    'from': 'likes', 
                    'localField': '_id', 
                    'foreignField': 'itemId', 
                    'as': 'like'
                  }
                }, {
                  '$addFields': {
                    'like': {
                      '$map': {
                        'input': '$like', 
                        'as': 'likeItem', 
                        'in': {
                          '$mergeObjects': [
                            '$$likeItem', {
                              'liked': {
                                '$cond': [
                                  {
                                    '$eq': [
                                      '$$likeItem.user', req.user._id
                                    ]
                                  }, true, false
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$addFields': {
                    'like': {
                      '$reduce': {
                        'input': '$like', 
                        'initialValue': false, 
                        'in': {
                          '$or': [
                            '$$value', '$$this.liked'
                          ]
                        }
                      }
                    }
                  }
                }
              ]
        )
        return global.sendResponse(res, 200, true, "Get comment successfully.", comment);
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}


// ========================================================== End Comemnt Flow ==========================================================

