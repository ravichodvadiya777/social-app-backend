import { Request, Response } from "express";
import chatHelper from "../db/chatHelper";
import {Types} from "mongoose";
// import {ChatType} from "../model/chatModel";
// import Chat from '../model/chatModel';




// ========================================================== Start chet Flow ==========================================================
// chet-list API
export async function chatList(req:Request, res:Response){
    try {
        const user = new Types.ObjectId(req.user._id);
        const chatList = await chatHelper.chatList(user); 
        return global.sendResponse(res, 200, true, "Get chat list successfully.", chatList);
    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}


export async function chatMessage(req:Request, res:Response){
    try {
        const {conversationId} = req.body
        const limit = req.body.limit > 100 ? 100 : req.body.limit || 20;
        // await Chat.updateMany({ conversionId: conversionId, receiverid: req.user._id }, { $set: { read: true } }, { new: true });

        const chatData = await chatHelper.find({conversationId : conversationId}, limit, '-createdAt');
        
        return global.sendResponse(res, 200, true, "Get chat messages", chatData);


    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

// ========================================================== End chet Flow ==========================================================

