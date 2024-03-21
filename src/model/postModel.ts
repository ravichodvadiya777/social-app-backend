import mongoose, { ObjectId }  from 'mongoose';

export type PostType ={
    user: ObjectId,
    title: string,
    description: string,
    photos: string[],
}
const PostModel = new mongoose.Schema<PostType>({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title: {
        type : String
    },
    description: {
        type : String
    },
    photos: {
        type: [String]
    }
},
{ timestamps: true, versionKey: false }
);

const PostType = mongoose.model<PostType>("Post", PostModel);
export default PostType