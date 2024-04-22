import Like from "../model/likeModel";
import { LikeType } from "../model/likeModel";
import { Types } from "mongoose";

// Define helper functions to interact with the database
const likeHelper = {
  findOne: async (query?: LikeType, select?: string) => {
    try {
      let queryBuilder = Like.findOne(query);

      if (select) {
        queryBuilder = queryBuilder.select(select);
      }

      const follow = await queryBuilder.exec();

      return follow;
    } catch (error) {
      console.error("Error retrieving like:", error);
      throw error;
    }
  },

  insertOne: async (data: LikeType) => {
    try {
      const result = await Like.create(data);
      return result;
    } catch (error) {
      console.error("Error adding like:", error);
      throw error;
    }
  },

  deleteOne: async (query: object) => {
    try {
      const result = await Like.deleteOne(query, { new: true });
      return result;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  getLikeById: async (
    itemId: Types.ObjectId,
    userId: Types.ObjectId,
    startIndex?: number,
    limit?: number
  ) => {
    try {
      const like = await Like.aggregate([
        {
          $match: {
            itemId: itemId,
          },
        },

        {
          $lookup: {
            from: "follows",
            localField: "user",
            foreignField: "follow",
            pipeline: [
              {
                $match: {
                  user: userId,
                },
              },
            ],
            as: "follow",
          },
        },
        {
          $addFields: {
            flag: {
              $cond: {
                if: {
                  $gt: [
                    {
                      $size: "$follow",
                    },
                    0,
                  ],
                },
                then: "following",
                else: {
                  $cond: {
                    if: {
                      $eq: ["$user", userId],
                    },
                    then: "loginUser",
                    else: "follow",
                  },
                },
              },
            },
          },
        },
        {
          $unset: "follow",
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
          $addFields: {
            user: { $first: "$user" },
          },
        },
        // {
        //   $unwind : "$user"
        // },
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
      return like;
    } catch (error) {
      console.error("Error retrieving like:", error);
      throw error;
    }
  },
};

export default likeHelper;
