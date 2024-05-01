import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type ChatSetting = {
  conversationId: string;
  user1: Types.ObjectId | SchemaDefinitionProperty<ObjectId, ChatSetting>;
  user2: Types.ObjectId | SchemaDefinitionProperty<ObjectId, ChatSetting>;
  deleteAfterView: boolean;
  delete24View: boolean;
};
const ChatSettingModel = new mongoose.Schema<ChatSetting>(
  {
    conversationId: {
      type: String,
      require: true,
    },
    user1: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    user2: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    deleteAfterView: {
      type: Boolean,
      default: false,
    },
    delete24View: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const ChatSetting = mongoose.model<ChatSetting>(
  "ChatSetting",
  ChatSettingModel
);
export default ChatSetting;
