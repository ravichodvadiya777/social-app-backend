import { Types } from "mongoose";
import Chat from "../model/chatModel";
import { ChatType } from "../model/chatModel";

// Define helper functions to interact with the database
const chatHelper = {
  // chatList
  chatList: async (user: Types.ObjectId) => {
    try {
      const chatList = await Chat.aggregate([
        {
          $match: {
            $or: [
              {
                sender: user,
              },
              {
                receiver: user,
              },
            ],
          },
        },
        {
          $group: {
            _id: "$conversationId",
            sender: {
              $last: "$sender",
            },
            receiver: {
              $last: "$receiver",
            },
            unread_msg: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$read", false],
                  },
                  1,
                  0,
                ],
              },
            },
            createdAt: {
              $last: "$createdAt",
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $addFields: {
            loggedNotUser: {
              $cond: {
                if: {
                  $eq: ["$sender", user],
                },
                then: "$receiver",
                else: "$sender",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "loggedNotUser",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  username: 1,
                  profileImg: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: "$loggedNotUser",
            conversationId: "$_id",
            username: {
              $first: "$user.username",
            },
            profileImg: {
              $first: "$user.profileImg",
            },
            name: {
              $first: "$user.name",
            },
            unread_msg: 1,
          },
        },
      ]);
      return chatList;
    } catch (error) {
      console.error("Error retrieving chatList:", error);
      throw error;
    }
  },
  // find
  find: async (
    query?: { conversationId: string },
    limit?: number,
    page?: number,
    sort: "createdAt" | "-createdAt" = "createdAt"
  ) => {
    try {
      let queryBuilder = Chat.find(query);

      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      if (page) {
        queryBuilder = queryBuilder.skip(limit * page);
      }

      queryBuilder = queryBuilder.sort(sort);

      const getChat = await queryBuilder.exec();

      return getChat;
    } catch (error) {
      console.error("Error retrieving comment:", error);
      throw error;
    }
  },

  insertOne: async (data: ChatType) => {
    try {
      const result = await Chat.create(data);
      return result;
    } catch (error) {
      console.error("Error adding chet:", error);
      throw error;
    }
  },
};

export default chatHelper;
