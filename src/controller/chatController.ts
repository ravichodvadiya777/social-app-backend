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
        const {conversationId,page} = req.query
        const limit = Number(req.query.limit) > 100 ? 100 : Number(req.query.limit) || 20;
        // await Chat.updateMany({ conversionId: conversionId, receiverid: req.user._id }, { $set: { read: true } }, { new: true });
        
        const records = await chatHelper.find({conversationId : conversationId as string}, null, null, '-createdAt');
        const pages = Math.ceil(records.length / limit);
        const hasNextPage = Number(page) < pages - 1;
        const hasPreviousPage = Number(page) > 1;
        // console.log(chatCount.length);
        const chatData = await chatHelper.find({conversationId : conversationId as string}, limit, Number(page), '-createdAt');
        
        return global.sendResponse(res, 200, true, "Get chat messages", {chatData,hasNextPage,hasPreviousPage});


    } catch (error) {
        console.log(error); 
        return global.sendResponse(res, 400, false, "Something not right, please try again.");
    }
}

// ========================================================== End chet Flow ==========================================================

