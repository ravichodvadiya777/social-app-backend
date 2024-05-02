import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type PostType = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, PostType>;
  description: string;
  photos: { url: string; type: string }[];
  mention: string[];
  // _id? : Types.ObjectId | SchemaDefinitionProperty<ObjectId, PostType>,
};
const PostModel = new mongoose.Schema<PostType>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
    },
    photos: {
      type: [
        {
          url: {
            type: String,
          },
          type: {
            type: String,
          },
        },
      ],
      required: true,
    },
    mention: {
      type: [mongoose.Types.ObjectId],
    },
  },
  { timestamps: true, versionKey: false }
);

const PostType = mongoose.model<PostType>("Post", PostModel);
export default PostType;
