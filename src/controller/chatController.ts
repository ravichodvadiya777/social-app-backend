import { Request, Response } from "express";
import chatHelper from "../db/chatHelper";
import { Types } from "mongoose";
import chatSettingHelper from "../db/chatSettingHelper";

// ========================================================== Start chet Flow ==========================================================
// chet-list API
export async function chatList(req: Request, res: Response) {
  try {
    const user = new Types.ObjectId(req.user._id);
    const chatList = await chatHelper.chatList(user);
    return global.sendResponse(
      res,
      200,
      true,
      "Get chat list successfully.",
      chatList
    );
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function chatMessage(req: Request, res: Response) {
  try {
    const { conversationId, page } = req.query;
    const limit =
      Number(req.query.limit) > 100 ? 100 : Number(req.query.limit) || 20;

    const chatData = await chatHelper.find(
      { conversationId: conversationId as string },
      limit,
      Number(page),
      new Types.ObjectId(req.user._id)
    );
    const pages = Math.ceil(chatData[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 1;

    return global.sendResponse(res, 200, true, "Get chat messages", {
      data: chatData[0].data,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function deleteChats(req: Request, res: Response) {
  try {
    const { conversationId, deleteType } = req.query;

    await chatSettingHelper.update(
      new Types.ObjectId(req.user._id),
      conversationId.toString(),
      Number(deleteType)
    );
    return global.sendResponse(res, 200, true, "Chat messages updated.");
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

// ========================================================== End chet Flow ==========================================================
