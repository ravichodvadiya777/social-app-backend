import Like from "../model/likeModel";
import {LikeType} from "../model/likeModel";

// Define helper functions to interact with the database
const likeHelper = {

    findOne: async (query?: LikeType, select?: string) => {
        try {
            let queryBuilder = Like.findOne(query);
            
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

    insertOne: async (data: LikeType) => {
        try {
            const result = await Like.create(data);
            return result;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    },

    // delete: async (query: object) => {
    //     try {
    //         const result = await Follow.deleteOne(query, {new : true});
    //         return result;
    //     } catch (error) {
    //         console.error('Error adding user:', error);
    //         throw error;
    //     }
    // },

};

export default likeHelper;
