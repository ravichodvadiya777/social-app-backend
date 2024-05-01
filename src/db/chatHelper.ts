import { Types } from "mongoose";
import Chat from "../model/chatModel";
import { ChatType } from "../model/chatModel";
import ChatSetting from "../model/chatSettingModel";

// Define helper functions to interact with the database
const chatHelper = {
  // chatList
  chatList: async (user: Types.ObjectId) => {
    try {
      const chatList = await ChatSetting.aggregate([
        {
          $match: {
            $or: [
              {
                user1: user,
              },
              {
                user2: user,
              },
            ],
          },
        },
        {
          $lookup: {
            from: "chats",
            localField: "conversationId",
            foreignField: "conversationId",
            as: "chats",
            pipeline: [
              {
                $group: {
                  _id: "$conversationId",
                  createdAt: {
                    $last: "$createdAt",
                  },
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
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: "$conversationId",
            sender: {
              $cond: [
                { $first: "$chats.sender" },
                { $first: "$chats.sender" },
                "$user1",
              ],
            },
            receiver: {
              $cond: [
                { $first: "$chats.receiver" },
                { $first: "$chats.receiver" },
                "$user2",
              ],
            },
            unread_msg: {
              $first: "$chats.unread_msg",
            },
            createdAt: {
              $last: "$chats.createdAt",
            },
            delete24View: 1,
            deleteAfterView: 1,
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
            unread_msg: {
              $cond: [{ $eq: ["$receiver", user] }, "$unread_msg", 0],
            },
            sender: 1,
            receiver: 1,
            delete24View: 1,
            deleteAfterView: 1,
          },
        },
      ]);
      // [
      //   {
      //     $match: {
      //       $or: [
      //         {
      //           sender: user,
      //         },
      //         {
      //           receiver: user,
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$conversationId",
      //       sender: {
      //         $last: "$sender",
      //       },
      //       receiver: {
      //         $last: "$receiver",
      //       },
      //       unread_msg: {
      //         $sum: {
      //           $cond: [
      //             {
      //               $eq: ["$read", false],
      //             },
      //             1,
      //             0,
      //           ],
      //         },
      //       },
      //       createdAt: {
      //         $last: "$createdAt",
      //       },
      //     },
      //   },
      //   {
      //     $sort: { createdAt: -1 },
      //   },
      //   {
      //     $addFields: {
      //       loggedNotUser: {
      //         $cond: {
      //           if: {
      //             $eq: ["$sender", user],
      //           },
      //           then: "$receiver",
      //           else: "$sender",
      //         },
      //       },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "loggedNotUser",
      //       foreignField: "_id",
      //       as: "user",
      //       pipeline: [
      //         {
      //           $project: {
      //             username: 1,
      //             profileImg: 1,
      //             name: 1,
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: "$loggedNotUser",
      //       conversationId: "$_id",
      //       username: {
      //         $first: "$user.username",
      //       },
      //       profileImg: {
      //         $first: "$user.profileImg",
      //       },
      //       name: {
      //         $first: "$user.name",
      //       },
      //       unread_msg: 1,
      //     },
      //   },
      // ]
      return chatList;
    } catch (error) {
      console.error("Error retrieving chatList:", error);
      throw error;
    }
  },
  // find
  find: async (
    query: { conversationId: string },
    limit: number,
    page: number,
    userId: Types.ObjectId
  ) => {
    try {
      const chatSetting = await ChatSetting.findOne({
        conversationId: query.conversationId,
      });
      if (chatSetting.deleteAfterView) {
        await Chat.deleteMany({
          conversationId: query.conversationId,
          receiver: userId,
          read: true,
        });
      }
      await Chat.updateMany(
        {
          conversationId: query.conversationId,
          receiver: userId,
          read: false,
        },
        { $set: { read: true } }
      );

      const getChat = await Chat.aggregate([
        { $match: query },
        {
          $facet: {
            totalRecord: [{ $count: "total" }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: limit * page },
              { $limit: limit },
            ],
          },
        },
        {
          $project: { data: 1, totalRecord: { $first: "$totalRecord.total" } },
        },
      ]);

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
