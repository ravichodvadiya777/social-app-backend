import mongoose  from 'mongoose';
import jwt from "jsonwebtoken";

export type UserRoles = "user" | 'admin'
export type UserType ={
    name: string,
    dob: Date,
    role: UserRoles,
    email: string,
    password: string,
    generateAuthToken: (expiresIn?: string) => Promise<string>,
    _doc?: {
        accessToken?: string
    },
    bio: string,
    username: string,
    _id : string
}
const UserModel = new mongoose.Schema<UserType>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dob:{
        type : Date
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique : true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    bio: {
        type:String,
    }
},
{ timestamps: true, versionKey: false }
);

//Sign JWT and Return
UserModel.methods.generateAuthToken = async function (expiresIn) {
    const token = jwt.sign(
      {
        id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET_KEY,
      expiresIn && { expiresIn: expiresIn }
    );
    return token;
  };
  
  UserModel.index({ email: 1 }, { unique: true });

const UserType = mongoose.model<UserType>("User", UserModel);
// module.exports = UserType;
export default UserType