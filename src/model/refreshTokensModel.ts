import mongoose, { ObjectId } from "mongoose";

export type TokenType = {
  token: string;
  user: ObjectId;
};
const RefreshTokenModel = new mongoose.Schema<TokenType>(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const RefreshToken = mongoose.model<TokenType>(
  "Refresh_token",
  RefreshTokenModel
);
export default RefreshToken;
