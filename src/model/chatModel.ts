import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type ChatType = {
  sender: Types.ObjectId | SchemaDefinitionProperty<ObjectId, ChatType>;
  receiver: Types.ObjectId | SchemaDefinitionProperty<ObjectId, ChatType>;
  msg: string;
  type: number;
  read: boolean;
  conversationId: string;
  createdAt: Date;
};
const ChatModel = new mongoose.Schema<ChatType>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    msg: {
      type: String,
    },
    type: {
      type: Number,
      require: true,
      enum: [1, 2, 3, 4], // 1-text, 2-img, 3-video, 4-document
    },
    read: {
      type: Boolean,
      require: true,
      default: false,
    },
    conversationId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ChatType = mongoose.model<ChatType>("Chat", ChatModel);
export default ChatType;
