import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import { Types } from "mongoose";
import likeHelper from "../db/likeHelper";
import { NotificationType } from "../model/notificationModel";
import postHelper from "../db/postHelper";
import notificationHelper from "../db/notificationHelper";
import settingHelper from "../db/settingHelper";
import pushNotification from "../utils/pushNotification";

export async function addLike(req: Request, res: Response) {
  try {
    const { postId, type, commentId } = req.body;
    let id: Types.ObjectId;
    switch (type) {
      case 1:
        id = postId;
        break;
      case 2:
        id = commentId;
        break;
      default:
        id = postId;
        break;
    }
    const obj = {
      user: new Types.ObjectId(req.user._id),
      postId: new Types.ObjectId(postId),
      itemId: new Types.ObjectId(id),
      type: type, // 1:post , 2:comment, 3:sub-comment
    };

    const checkLike = await likeHelper.findOne(obj);

    if (checkLike) {
      return global.sendResponse(res, 409, false, "Already liked.");
    }
    if (commentId) {
      const comment = await commentHelper.findOne({ _id: commentId });
      // check comment in postId
      if (comment.postId.toString() !== postId) {
        return global.sendResponse(
          res,
          406,
          false,
          "This is not belong to this post."
        );
      }
    }
    let item;
    if (type === 1) {
      item = await postHelper.findOne(
        { _id: new Types.ObjectId(postId) },
        "user"
      );
    } else {
      item = await commentHelper.findOne(
        { _id: new Types.ObjectId(commentId) },
        "user description"
      );
    }
    const like = await likeHelper.insertOne(obj);

    const likeNoti = await settingHelper.get(
      new Types.ObjectId(item.user.toString())
    );
    if (req.user._id.toString() !== item.user.toString() && likeNoti.like) {
      const notificationObj: NotificationType = {
        sender: new Types.ObjectId(req.user._id),
        receiver: item.user,
        itemId: item._id,
        text: `recently like your ${
          type === 1 ? "post" : "comment : {{commentDesc}}"
        }.`,
        type: type === 1 ? "postLike" : "commentLike",
      };
      await pushNotification(
        `Like`,
        `like your ${type === 1 ? "post" : "comment : " + item.description}.`,
        {
          _id: item._id.toString(),
          type: "LIKE",
        },
        [item.user]
      );
      await notificationHelper.insertOne(notificationObj);
    }
    return global.sendResponse(res, 201, true, "Liked Successfully", like);
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function unlike(req: Request, res: Response) {
  try {
    const like = await likeHelper.findOne({
      itemId: new Types.ObjectId(req.params.id),
      user: new Types.ObjectId(req.user._id),
    });
    let item;
    if (like.type === 1) {
      item = await postHelper.findOne(
        { _id: new Types.ObjectId(req.params.id) },
        "user"
      );
    } else {
      item = await commentHelper.findOne(
        { _id: new Types.ObjectId(req.params.id) },
        "user"
      );
    }
    await likeHelper.deleteOne({ itemId: req.params.id, user: req.user._id });
    if (req.user._id.toString() !== item.user.toString()) {
      const notificationObj: NotificationType = {
        sender: new Types.ObjectId(req.user._id),
        receiver: item.user,
        itemId: like.itemId,
        type: like.type === 1 ? "postLike" : "commentLike",
      };
      await notificationHelper.deleteOne(notificationObj);
    }
    return global.sendResponse(res, 200, true, "Unliked successfully");
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

// get like data
export async function getLikeById(req: Request, res: Response) {
  try {
    const id = new Types.ObjectId(req.params.id);
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const getLike = await likeHelper.getLikeById(
      id,
      new Types.ObjectId(req.user._id),
      startIndex,
      limit
    );
    const pages = Math.ceil(getLike[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;
    return global.sendResponse(res, 200, true, "Get liked successfully", {
      getLike: getLike[0].data,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}
