import mongoose, { ObjectId, Types, SchemaDefinitionProperty } from "mongoose";

export type LikeType = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, LikeType>;
  postId: Types.ObjectId | SchemaDefinitionProperty<ObjectId, LikeType>;
  itemId: Types.ObjectId | SchemaDefinitionProperty<ObjectId, LikeType>;
  type: number;
};
const LikeModel = new mongoose.Schema<LikeType>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    postId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Post",
    },
    itemId: {
      type: mongoose.Types.ObjectId,
    },
    type: {
      type: Number,
      enum: [1, 2, 3], //1:post , 2:comment, 3:subComment
    },
  },
  { timestamps: true, versionKey: false }
);

const LikeType = mongoose.model<LikeType>("Like", LikeModel);
export default LikeType;
