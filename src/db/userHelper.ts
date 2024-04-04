// import connectDB from "./db";
import User from "../model/userModel";
// import { UserType } from "../model/userModel";
import { Types } from "mongoose";

// Ensure database connection is established before using helper functions
// connectDB();

// Define helper functions to interact with the database
const userHelper = {
    // Data find
    find: async (query?: {username? : object}, select?: string, sort: 'createdAt' | '-createdAt'='createdAt') => {
        try {
            let queryBuilder = User.find(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            queryBuilder = queryBuilder.sort(sort);
            const post = await queryBuilder.exec();
        
            return post;
        } catch (error) {
            console.error('Error retrieving users:', error);
            throw error;
        }
    },

    // FindOne
    findOne: async (query?: {email?: string, _id? : Types.ObjectId, username? : string}, select?: string) => {
        try {
            let queryBuilder = User.findOne(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            const post = await queryBuilder.exec();
            return post;
        } catch (error) {
            console.error('Error retrieving users:', error);
            throw error;
        }
    },

    insertOne: async (data: {name : string, dob : Date, email : string, password : string, username: string}) => {
        try {
            const result = await User.create(data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    updateMany: async (query: {name? : string, dob? : Date, email? : string}, data: object, option: object) => {
        try {
            const result = await User.updateMany(query,data,option);
            return result;
        } catch (error) {
            console.error('Error update user:', error);
            throw error;
        }
    },

    updateOne: async (query: {_id? : string}, data: {name? : string, dob? : Date, email? : string, password? : string}) => {
        try {
            const result = await User.updateOne(query,data);
            return result;
        } catch (error) {
            console.error('Error update user:', error);
            throw error;
        }
    },

    delete: async (query: object) => {
        try {
            const result = await User.deleteOne(query, {new : true});
            return result;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

};

export default userHelper;
