import connectDB from "./db";
import User from "../model/userModel";

// Ensure database connection is established before using helper functions
connectDB();

// Define helper functions to interact with the database
const userHelper = {
    // Data find
    find: async (query?: object, select?: string, sort?: string ) => {
        try {
            let queryBuilder = User.find(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            if(sort) {
                queryBuilder = queryBuilder.sort(sort);
            }
            
            const post = await queryBuilder.exec();
            return post;
        } catch (error) {
            console.error('Error retrieving users:', error);
            throw error;
        }
    },

    // FindOne
    findOne: async (query?: object, select?: string, sort?: string) => {
        try {
            let queryBuilder = User.findOne(query);
            
            if(select) {
                queryBuilder = queryBuilder.select(select);
            }
            if(sort) {
                queryBuilder = queryBuilder.sort(sort);
            }
            
            const post = await queryBuilder.exec();
            return post;
        } catch (error) {
            console.error('Error retrieving users:', error);
            throw error;
        }
    },

    insertOne: async (data: object) => {
        try {
            const result = await User.create(data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    updateMany: async (query: object, data: object, option: object) => {
        try {
            const result = await User.updateMany(query,data,option);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    updateOne: async (query: object, data: object) => {
        try {
            const result = await User.updateOne(query,data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    delete: async (query: object, option: object) => {
        try {
            const result = await User.deleteOne(query, option);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

};

export default userHelper;
