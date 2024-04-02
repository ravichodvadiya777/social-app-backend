import mongoose, {  ObjectId, SchemaDefinitionProperty, Types }  from 'mongoose';

export type CommentType = {
    user: Types.ObjectId | SchemaDefinitionProperty<ObjectId, CommentType>,
    postId: Types.ObjectId | SchemaDefinitionProperty<ObjectId, CommentType>,
    commentId?: Types.ObjectId | SchemaDefinitionProperty<ObjectId, CommentType>,
    description: string,
}
const CommentModel = new mongoose.Schema<CommentType>({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    postId: {
        type : mongoose.Types.ObjectId,
        required: true,
        ref: "Post"
    },
    commentId: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    },
    description : {
        type : String,
        required : true
    }
},
{ timestamps: true, versionKey: false }
);

const CommentType = mongoose.model<CommentType>("Comment", CommentModel);
export default CommentType