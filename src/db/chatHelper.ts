import { Types } from "mongoose";
import Chat from "../model/chatModel";
import {ChatType} from "../model/chatModel";

// Define helper functions to interact with the database
const chatHelper = {
    // chatList
    chatList : async (user : Types.ObjectId) => {
        try {
            const chatList = await Chat.aggregate([
                {
                  '$match': {
                    '$or': [
                      {
                        'sender': user
                      }, {
                        'receiver': user
                      }
                    ]
                  }
                }, {
                  '$group': {
                    '_id': '$conversationId', 
                    'sender': {
                      '$last': '$sender'
                    }, 
                    'receiver': {
                      '$last': '$receiver'
                    }, 
                    'unread_msg': {
                      '$sum': {
                        '$cond': [
                          {
                            '$eq': [
                              '$read', false
                            ]
                          }, 1, 0
                        ]
                      }
                    }
                  }
                }, {
                  '$addFields': {
                    'loggedNotUser': {
                      '$cond': {
                        'if': {
                          '$eq': [
                            '$sender', user
                          ]
                        }, 
                        'then': '$receiver', 
                        'else': '$sender'
                      }
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'loggedNotUser', 
                    'foreignField': '_id', 
                    'as': 'user', 
                    'pipeline': [
                      {
                        '$project': {
                          'username': 1, 
                          'profileImg': 1, 
                          'name': 1
                        }
                      }
                    ]
                  }
                }, {
                  '$project': {
                    '_id': 1, 
                    'username': {
                      '$first': '$user.username'
                    }, 
                    'profileImg': {
                      '$first': '$user.profileImg'
                    }, 
                    'name': {
                      '$first': '$user.name'
                    }, 
                    'unread_msg': 1
                  }
                }
              ]);
              return chatList;
            
        } catch (error) {
            console.error('Error retrieving chatList:', error);
            throw error;
        }
    },
    // find
    find: async (query?: {conversationId : string}, limit: number=10, sort : 'createdAt' | '-createdAt'='createdAt') => {
        try {
        
            let queryBuilder = Chat.find(query); 
            
            if(limit) {
                queryBuilder = queryBuilder.limit(limit);
            }
            
            queryBuilder = queryBuilder.sort(sort);
            
            const comment = await queryBuilder.exec();
            
            return comment;
        } catch (error) {
            console.error('Error retrieving comment:', error);
            throw error;
        }
    },

    // FindOne
    // findOne: async (query?: {_id? : Types.ObjectId}, select?: string) => {
    //     try {
    //         let queryBuilder = Comment.findOne(query);
            
    //         if(select) {
    //             queryBuilder = queryBuilder.select(select);
    //         }
            
    //         const comment = await queryBuilder.exec();
            
    //         return comment;
    //     } catch (error) {
    //         console.error('Error retrieving comments:', error);
    //         throw error;
    //     }
    // },

    insertOne: async (data: ChatType) => {
        try {
            const result = await Chat.create(data);
            return result;
        } catch (error) {
            console.error('Error adding chet:', error);
            throw error;
        }
    },

};

export default chatHelper;
