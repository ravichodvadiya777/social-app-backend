import { ObjectId, Types } from "mongoose";
import Story from "../model/storyModel";
import Follow from "../model/followModel";

// Define helper functions to interact with the database
const storyHelper = {
  // Data find
  find: async (
    query?: { user?: Types.ObjectId },
    select?: string,
    sort: string = "createdAt"
  ) => {
    try {
      let queryBuilder = Story.find(query);

      if (select) {
        queryBuilder = queryBuilder.select(select);
      }
      if (sort) {
        queryBuilder = queryBuilder.sort(sort);
      }
      const result = await queryBuilder.exec();
      return result;
    } catch (error) {
      console.error("Error retrieving story:", error);
      throw error;
    }
  },

  insertOne: async (data: {
    user: ObjectId;
    story: { url: string; type: string };
  }) => {
    try {
      const result = await Story.create(data);
      return result;
    } catch (error) {
      console.error("Error adding story:", error);
      throw error;
    }
  },

  deleteOne: async (query: object) => {
    try {
      const result = await Story.deleteOne(query, { new: true });
      return result;
    } catch (error) {
      console.error("Error deleting story:", error);
      throw error;
    }
  },

  getStory: async (userId: Types.ObjectId) => {
    try {
      const getStory = await Follow.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $group: {
            _id: null,
            users: {
              $push: "$follow",
            },
          },
        },
        {
          $set: {
            users: {
              $concatArrays: ["$users", [userId]],
            },
          },
        },
        {
          $lookup: {
            from: "stories",
            localField: "users",
            foreignField: "user",
            as: "stories",
          },
        },
        {
          $unwind: {
            path: "$stories",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $replaceRoot: {
            newRoot: "$stories",
          },
        },
        {
          $group: {
            _id: "$user",
            story: {
              $push: "$story",
            },
          },
        },
        {
          $match: {
            story: {
              $gt: {
                $size: 0,
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "follow_friend",
            pipeline: [
              {
                $project: {
                  name: 1,
                  username: 1,
                  profileImg: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            loginUser: {
              $cond: [
                {
                  $in: [userId, "$follow_friend._id"],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $sort: {
            loginUser: -1,
          },
        },
        {
          $project: {
            _id: 0,
            story: 1,
            follow_friend: {
              $first: "$follow_friend",
            },
            loginUser: 1,
          },
        },
      ]);
      return getStory;
    } catch (error) {
      console.error("Error retrieving story", error);
      throw error;
    }
  },
};

export default storyHelper;
