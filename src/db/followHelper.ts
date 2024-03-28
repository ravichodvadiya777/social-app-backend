import Follow from "../model/followModel";
import {FollowType} from "../model/followModel";

// Define helper functions to interact with the database
const followHelper = {

    findOne: async (query?: FollowType, select?: string) => {
        try {
            let queryBuilder = Follow.findOne(query);
            
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

    insertOne: async (data: FollowType) => {
        try {
            const result = await Follow.create(data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    delete: async (query: object) => {
        try {
            const result = await Follow.deleteOne(query, {new : true});
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

};

export default followHelper;
