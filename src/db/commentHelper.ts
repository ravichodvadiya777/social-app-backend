import { Types } from "mongoose";
import Comment from "../model/commentModel";
import { CommentType } from "../model/commentModel";

// Define helper functions to interact with the database
const commentHelper = {
  // find
  find: async (
    query?: { postId: Types.ObjectId },
    select?: string,
    sort: string = "createdAt"
  ) => {
    try {
      let queryBuilder = Comment.find(query);

      if (select) {
        queryBuilder = queryBuilder.select(select);
      }
      if (sort) {
        queryBuilder = queryBuilder.sort(sort);
      }

      const comment = await queryBuilder.exec();
      return comment;
    } catch (error) {
      console.error("Error retrieving comment:", error);
      throw error;
    }
  },

  // FindOne
  findOne: async (query?: { _id?: Types.ObjectId }, select?: string) => {
    try {
      let queryBuilder = Comment.findOne(query);

      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      const comment = await queryBuilder.exec();

      return comment;
    } catch (error) {
      console.error("Error retrieving comments:", error);
      throw error;
    }
  },

  insertOne: async (data: CommentType) => {
    try {
      const result = await Comment.create(data);
      return result;
    } catch (error) {
      console.error("Error adding comments:", error);
      throw error;
    }
  },

  delete: async (query: object) => {
    try {
      const result = await Comment.deleteOne(query, { new: true });
      return result;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  deleteMany: async (query: object) => {
    try {
      const result = await Comment.deleteMany(query, { new: true });
      return result;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  getCommentByPostId: async (
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    startIndex?: number,
    limit?: number
  ) => {
    try {
      const comment = await Comment.aggregate([
        {
          $match: {
            postId: postId,
            commentId: { $exists: false },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
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
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "commentId",
            as: "subComment",
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "itemId",
            as: "like",
          },
        },
        {
          $addFields: {
            user: { $first: "$user" },
          },
        },
        {
          $addFields: {
            likeCount: {
              $size: "$like",
            },
            like: {
              $map: {
                input: "$like",
                as: "likeItem",
                in: {
                  $mergeObjects: [
                    "$$likeItem",
                    {
                      liked: {
                        $cond: [
                          {
                            $eq: ["$$likeItem.user", userId],
                          },
                          true,
                          false,
                        ],
                      },
                    },
                  ],
                },
              },
            },
            subComment: { $size: "$subComment" },
          },
        },
        {
          $addFields: {
            like: {
              $reduce: {
                input: "$like",
                initialValue: false,
                in: {
                  $or: ["$$value", "$$this.liked"],
                },
              },
            },
          },
        },
        {
          $facet: {
            totalRecord: [{ $count: "total" }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: startIndex },
              { $limit: limit },
            ],
          },
        },
        {
          $project: { data: 1, totalRecord: { $first: "$totalRecord.total" } },
        },
      ]);
      return comment;
    } catch (error) {
      console.error("Error retrieving comment:", error);
      throw error;
    }
  },

  getSubCommentByCommentId: async (
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
    startIndex?: number,
    limit?: number
  ) => {
    try {
      const subComment = await Comment.aggregate([
        {
          $match: {
            commentId: commentId,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
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
        // {
        //   $unwind : "$user"
        // },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "itemId",
            as: "like",
            // 'pipeline':[{'$match':{'user': userId}}]
          },
        },
        {
          $addFields: {
            likeCount: {
              $size: "$like",
            },
          },
        },
        {
          $addFields: {
            user: { $first: "$user" },
          },
        },
        {
          $addFields: {
            like: {
              $cond: {
                if: {
                  $anyElementTrue: {
                    $map: {
                      input: "$like",
                      as: "likeItem",
                      in: {
                        $eq: ["$$likeItem.user", userId],
                      },
                    },
                  },
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $facet: {
            totalRecord: [{ $count: "total" }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: startIndex },
              { $limit: limit },
            ],
          },
        },
        {
          $project: { data: 1, totalRecord: { $first: "$totalRecord.total" } },
        },
        // {
        //   $match : {
        //     'like.user' : {$in : ObjectId("660e4e82d02a819a690bf3dd")}
        //   }
        // },
        // {
        //   $addFields : {
        //     'like': {
        //       '$cond': [
        //         { '$eq': [{ '$size': "$like" }, 1] },
        //         true,
        //         false,
        //       ],
        //     },
        //   }
        // }
      ]);
      return subComment;
    } catch (error) {
      console.error("Error retrieving subComment:", error);
      throw error;
    }
  },
};

export default commentHelper;
