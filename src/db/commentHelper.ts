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

    getCommentByPostId: async (postId : Types.ObjectId, userId: Types.ObjectId) => {
        try {
            const comment = await Comment.aggregate(
                [
                    {
                      $match: {
                        'postId': postId,
                        'commentId' : {$exists : false}
                      }
                    },
                    {
                        $lookup: {
                            'from': "comments",
                            'localField': "_id",
                            'foreignField': "commentId",
                            'as': "comment"
                        }
                    } ,
                    {
                      $lookup: {
                        'from': 'likes', 
                        'localField': '_id', 
                        'foreignField': 'itemId', 
                        'as': 'like'
                      }
                    }, 
                    {
                      $addFields: {
                        'like': {
                          '$map': {
                            'input': '$like', 
                            'as': 'likeItem', 
                            'in': {
                              '$mergeObjects': [
                                '$$likeItem', {
                                  'liked': {
                                    '$cond': [
                                      {
                                        '$eq': [
                                          '$$likeItem.user', userId
                                        ]
                                      }, true, false
                                    ]
                                  }
                                }
                              ]
                            }
                          }
                        },
                        comment : {$size : "$comment"}
                      }
                    }, {
                      '$addFields': {
                        'like': {
                          '$reduce': {
                            'input': '$like', 
                            'initialValue': false, 
                            'in': {
                              '$or': [
                                '$$value', '$$this.liked'
                              ]
                            }
                          }
                        }
                      }
                    }
                  ]
            );
            return comment;
        } catch (error) {
            console.error('Error retrieving comment:', error);
            throw error;
        }
    },

    getSubCommentByCommentId: async (commentId : Types.ObjectId, userId: Types.ObjectId) => {
        try {
            const subComment = await Comment.aggregate([
                {
                  '$match': {
                    'commentId': commentId
                  }
                }, {
                  '$lookup': {
                    'from': 'likes', 
                    'localField': '_id', 
                    'foreignField': 'itemId', 
                    'as': 'like'
                  }
                }, {
                  '$addFields': {
                    'like': {
                      '$map': {
                        'input': '$like', 
                        'as': 'likeItem', 
                        'in': {
                          '$mergeObjects': [
                            '$$likeItem', {
                              'liked': {
                                '$cond': [
                                  {
                                    '$eq': [
                                      '$$likeItem.user', userId
                                    ]
                                  }, true, false
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  }
                }, {
                  '$addFields': {
                    'like': {
                      '$reduce': {
                        'input': '$like', 
                        'initialValue': false, 
                        'in': {
                          '$or': [
                            '$$value', '$$this.liked'
                          ]
                        }
                      }
                    }
                  }
                }
              ])
              return subComment;
        } catch (error) {
            console.error('Error retrieving subComment:', error);
            throw error;
        }
    }

};

export default commentHelper;
