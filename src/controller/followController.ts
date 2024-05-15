import { Request, Response } from "express";
// import Post from "../model/postModel";
import followHelper from "../db/followHelper";
import { Types } from "mongoose";
import { FollowType } from "../model/followModel";
import { NotificationType } from "../model/notificationModel";
import notificationHelper from "../db/notificationHelper";
import settingHelper from "../db/settingHelper";
import pushNotification from "../utils/pushNotification";

// ========================================================== Start follow Flow ==========================================================
// follow
export async function follow(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const followId = new Types.ObjectId(req.body.follow);

    const obj: FollowType = {
      user: userId,
      follow: followId,
    };
    const alreadyFollow = await followHelper.findOne(obj);
    if (alreadyFollow) {
      return global.sendResponse(res, 409, false, "Already Followed");
    }

    if (userId.equals(followId)) {
      return global.sendResponse(res, 409, false, "You can't follow yourself");
    }

    const follow = await followHelper.insertOne(obj);

    const followNoti = await settingHelper.get(new Types.ObjectId(followId));
    if (
      req.user._id.toString() !== req.body.follow.toString() &&
      followNoti.follow
    ) {
      const notificationObj: NotificationType = {
        sender: userId,
        receiver: followId,
        itemId: followId,
        text: "start following you.",
        type: "follow",
      };
      await pushNotification(
        `Follow`,
        `${req.user.username} start following you.`,
        {
          _id: follow._id.toString(),
          type: "FOLLOW",
        },
        [followId.toString()]
      );
      await notificationHelper.insertOne(notificationObj);
    }

    return global.sendResponse(res, 201, true, "Follow successfully.", follow);
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

// unfollow
export async function unfollow(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const followId = new Types.ObjectId(req.body.follow);

    const obj: FollowType = {
      user: userId,
      follow: followId,
    };
    const unfollow = await followHelper.findOne(obj);
    if (!unfollow) {
      return global.sendResponse(res, 409, false, "You can't unfollow");
    }
    await followHelper.deleteOne(obj);
    if (req.user._id.toString() !== req.body.follow.toString()) {
      const notificationObj: NotificationType = {
        sender: userId,
        receiver: followId,
        itemId: followId,
        text: "start following you.",
        type: "follow",
      };
      await notificationHelper.deleteOne(notificationObj);
    }
    return global.sendResponse(res, 200, true, "Unfollow successfully.");
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

// followers list
export async function followersList(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const friendId = new Types.ObjectId(req.params.id);

    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const followers = await followHelper.followersList(
      friendId,
      userId,
      startIndex,
      limit
    );
    const pages = Math.ceil(followers[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;
    return global.sendResponse(res, 200, true, "Get followers successfully.", {
      data: followers[0].data,
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

// following list
export async function followingList(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const friendId = new Types.ObjectId(req.params.id);

    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const following = await followHelper.followingList(
      friendId,
      userId,
      startIndex,
      limit
    );

    const pages = Math.ceil(following[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;

    return global.sendResponse(res, 200, true, "Get following successfully.", {
      data: following[0].data,
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

// suggested friends
export async function suggestedFriends(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const suggestedFriendsList = await followHelper.suggestedFriends(userId);
    return global.sendResponse(
      res,
      200,
      true,
      "Get suggested friend successfully.",
      suggestedFriendsList[0]
    );
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

// ========================================================== End follow Flow ==========================================================
