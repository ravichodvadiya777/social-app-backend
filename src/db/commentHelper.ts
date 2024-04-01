import {  Types } from "mongoose";
import Comment from "../model/commentModel";
import {CommentType} from "../model/commentModel";

// Define helper functions to interact with the database
const commentHelper = {
    // find
    find: async (query?: {postId : Types.ObjectId}, select?: string, sort: string = "createdAt" ) => {
        try {
            let queryBuilder = Comment.find(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            if(sort) {
                queryBuilder = queryBuilder.sort(sort);
            }
            
            const comment = await queryBuilder.exec();
            return comment;
        } catch (error) {
            console.error('Error retrieving comment:', error);
            throw error;
        }
    },

    // FindOne
    findOne: async (query?: {_id? : Types.ObjectId}, select?: string) => {
        try {
            let queryBuilder = Comment.findOne(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            
            const comment = await queryBuilder.exec();
            
            return comment;
        } catch (error) {
            console.error('Error retrieving comments:', error);
            throw error;
        }
    },

    insertOne: async (data: CommentType) => {
        try {
            const result = await Comment.create(data);
            return result;
        } catch (error) {
            console.error('Error adding comments:', error);
            throw error;
        }
    },

    delete: async (query: object) => {
        try {
            const result = await Comment.deleteOne(query, {new : true});
            return result;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

};

export default commentHelper;
