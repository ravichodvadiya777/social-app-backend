import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";
import { PostType } from "./postModel";
import { LikeType } from "./likeModel";

export type NotificationType = {
  sender: Types.ObjectId | SchemaDefinitionProperty<ObjectId, NotificationType>;
  receiver: Types.ObjectId | SchemaDefinitionProperty<ObjectId, PostType>;
  itemId?: Types.ObjectId | SchemaDefinitionProperty<ObjectId, LikeType>;
  text?: string;
  type: string;
  read?: boolean;
  createdAt?: Date;
};
const NotificationModel = new mongoose.Schema<NotificationType>(
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
    itemId: {
      type: mongoose.Types.ObjectId,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      require: true,
      enum: ["follow", "post", "comment", "postLike", "commentLike", "story"],
    },
    read: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model<NotificationType>("Notifications", NotificationModel);
export default Notification;
