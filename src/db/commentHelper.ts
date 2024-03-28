import {  Types } from "mongoose";
import Comment from "../model/commentModel";
import {CommentType} from "../model/commentModel";

// Define helper functions to interact with the database
const commentHelper = {
    // FindOne
    findOne: async (query?: {_id? : Types.ObjectId}, select?: string) => {
        try {
            let queryBuilder = Comment.findOne(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            
            const follow = await queryBuilder.exec();
            
            return follow;
        } catch (error) {
            console.error('Error retrieving users:', error);
            throw error;
        }
    },

    insertOne: async (data: CommentType) => {
        try {
            const result = await Comment.create(data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    delete: async (query: object) => {
        try {
            const result = await Comment.deleteOne(query, {new : true});
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

};

export default commentHelper;
