import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type Setting = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, Setting>;
  follow: boolean;
  post: boolean;
  comment: boolean;
  like: boolean;
  createdAt: Date;
};
const SettingModel = new mongoose.Schema<Setting>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    follow: {
      type: Boolean,
      default: true,
    },
    post: {
      type: Boolean,
      default: true,
    },
    comment: {
      type: Boolean,
      default: true,
    },
    like: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Settings = mongoose.model<Setting>("Settings", SettingModel);
export default Settings;
