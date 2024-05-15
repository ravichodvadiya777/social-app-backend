import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type DeviceType = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, DeviceType>;
  fcmToken: string;
};
const DeviceModel = new mongoose.Schema<DeviceType>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fcmToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Device = mongoose.model<DeviceType>("Device", DeviceModel);
export default Device;
