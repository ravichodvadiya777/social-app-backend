import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type FollowType = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, FollowType>;
  follow: Types.ObjectId | SchemaDefinitionProperty<ObjectId, FollowType>;
};
const FollowModel = new mongoose.Schema<FollowType>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    follow: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const FollowType = mongoose.model<FollowType>("Follow", FollowModel);
export default FollowType;
