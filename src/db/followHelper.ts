import { Types } from "mongoose";
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
            console.error('Error retrieving follow:', error);
            throw error;
        }
    },

    insertOne: async (data: FollowType) => {
        try {
            const result = await Follow.create(data);
            return result;
        } catch (error) {
            console.error('Error adding follow:', error);
            throw error;
        }
    },

    delete: async (query: object) => {
        try {
            const result = await Follow.deleteOne(query, {new : true});
            return result;
        } catch (error) {
            console.error('Error deleting follow:', error);
            throw error;
        }
    },

    followersList: async (userId : Types.ObjectId) => {
        try {
            const followers = await Follow.aggregate([
                {
                  '$match': {
                    'follow': userId
                  }
                },
                {
                    $sort : { 
                        createdAt : -1
                    }
                }, 
                {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'user', 
                    'foreignField': '_id', 
                    'as': 'user', 
                    'pipeline': [
                      {
                        '$project': {
                          'name': 1, 
                          'profileImg': 1, 
                          'username': 1
                        }
                      }
                    ]
                  }
                }, {
                  '$unwind': '$user'
                }, {
                  '$lookup': {
                    'from': 'follows', 
                    'localField': 'user._id', 
                    'foreignField': 'follow', 
                    'as': 'followBack', 
                    'pipeline': [
                      {
                        '$match': {
                          'user': userId
                        }
                      }
                    ]
                  }
                }, {
                  '$addFields': {
                    'followBack': {
                      '$cond': [
                        {
                          '$eq': [
                            {
                              '$size': '$followBack'
                            }, 0
                          ]
                        }, false, true
                      ]
                    }
                  }
                }
              ]);
            return followers;
        } catch (error) {
            console.error('Error retrieving follower:', error);
            throw error;
        }
    },

    followingList: async (userId : Types.ObjectId) => {
        try {
            const following = await Follow.aggregate([
                {
                  $match: {
                    user: userId,
                  },
                },
                {
                    $sort : { 
                        createdAt : -1
                    }
                },
                 {
                    $lookup: {
                      from: "users",
                      localField: "follow",
                      foreignField: "_id",
                      as: "user",
                      pipeline: [
                        {
                          $project: {
                            name: 1,
                            profileImg: 1,
                            username: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $unwind : "$user"
                  },
              ])
              return following;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

};

export default followHelper;
