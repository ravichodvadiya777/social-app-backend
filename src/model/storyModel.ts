import mongoose, { ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

export type StoryType = {
  user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, StoryType>;
  story: { url: string; type: string };
  createdAt: Date;
};
const StoryModel = new mongoose.Schema<StoryType>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    story: {
      url: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const StoryType = mongoose.model<StoryType>("Story", StoryModel);
export default StoryType;
