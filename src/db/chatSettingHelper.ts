import { Types } from "mongoose";
import ChatSetting from "../model/chatSettingModel";
import Chat from "../model/chatModel";

// Define helper functions to interact with the database
const chatSettingHelper = {
  insertOne: async (data: {
    conversationId: string;
    user1: Types.ObjectId;
    user2: Types.ObjectId;
  }) => {
    try {
      const result = await ChatSetting.create(data);
      return result;
    } catch (error) {
      console.error("Error adding chet:", error);
      throw error;
    }
  },

  findOne: async (data: { conversationId: string }) => {
    try {
      const result = await ChatSetting.findOne(data);
      return result;
    } catch (error) {
      console.error("Error adding chet:", error);
      throw error;
    }
  },

  // delete chat
  update: async (
    user: Types.ObjectId,
    conversationId: string,
    deleteType: number
  ) => {
    // deleteType : 1 => delete all , 2 => delete after view, 3 => delete 24hr after view
    try {
      if (deleteType === 1 || deleteType === 2) {
        const obj = {};
        if (deleteType === 2) {
          obj["read"] = true;
        }
        await Chat.deleteMany({
          $and: [
            { $or: [{ sender: user }, { receiver: user }] },
            { conversationId: conversationId },
            obj,
          ],
        });
      }
      if (deleteType === 2) {
        await ChatSetting.updateMany(
          { conversationId: conversationId },
          { $set: { deleteAfterView: true, delete24View: false } }
        );
      }
      if (deleteType === 3) {
        await ChatSetting.updateMany(
          { conversationId: conversationId },
          { $set: { deleteAfterView: false, delete24View: true } }
        );
      }
    } catch (error) {
      console.error("Error retrieving chatList:", error);
      throw error;
    }
  },
};

export default chatSettingHelper;
