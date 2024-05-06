import { Types } from "mongoose";
import Notification, { NotificationType } from "../model/notificationModel";

const notificationHelper = {
  insertOne: async (query: NotificationType) => {
    try {
      const result = await Notification.create(query);
      global.io.to(query.receiver.toString()).emit("notificationCount");
      return result;
    } catch (error) {
      console.error("Error inserting notification:", error);
      throw error;
    }
  },

  deleteOne: async (query: object) => {
    try {
      const result = await Notification.findOneAndDelete(query);
      return result;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  get: async (user: Types.ObjectId, limit: number, page: number) => {
    try {
      const result = await Notification.aggregate([
        {
          $match: {
            receiver: user,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender_info",
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
          $lookup: {
            from: "posts",
            localField: "itemId",
            foreignField: "_id",
            as: "post",
            pipeline: [
              {
                $project: {
                  photos: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "itemId",
            foreignField: "_id",
            as: "comment",
            pipeline: [
              {
                $project: {
                  description: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$sender_info",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$post",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$comment",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            text: {
              $replaceAll: {
                input: "$text",
                find: "{{commentDesc}}",
                replacement: {
                  $cond: ["$comment", "$comment.description", "unknown text"],
                },
              },
            },
          },
        },
        {
          $facet: {
            totalRecord: [{ $count: "total" }],
            data: [{ $sort: { createdAt: -1 } }, { $skip: limit * page }, { $limit: limit }],
          },
        },
        {
          $project: { data: 1, totalRecord: { $first: "$totalRecord.total" } },
        },
      ]);
      return result;
    } catch (error) {
      console.error("Error retrieving notification:", error);
      throw error;
    }
  },

  getCount: async (user: Types.ObjectId) => {
    try {
      const result = await Notification.countDocuments({ receiver: user, read: false });
      return result;
    } catch (error) {
      console.error("Error get notification:", error);
      throw error;
    }
  },

  patch: async (user: Types.ObjectId) => {
    try {
      const result = await Notification.updateMany({ receiver: user, read: false }, { $set: { read: true } });
      return result;
    } catch (error) {
      console.error("Error get notification:", error);
      throw error;
    }
  },
};

export default notificationHelper;
