import { Request, Response } from "express";
import commentHelper from "../db/commentHelper";
import { Types } from "mongoose";
import { CommentType } from "../model/commentModel";
import notificationHelper from "../db/notificationHelper";
import postHelper from "../db/postHelper";
import { NotificationType } from "../model/notificationModel";
import { PostType } from "../model/postModel";
import settingHelper from "../db/settingHelper";
import pushNotification from "../utils/pushNotification";

// ========================================================== Start Comment Flow ==========================================================
// create a new commet
export async function addComment(req: Request, res: Response) {
  try {
    const { postId, commentId, description } = req.body;
    const obj: CommentType = {
      user: new Types.ObjectId(req.user._id),
      postId: new Types.ObjectId(postId),
      description: description,
    };

    if (commentId) {
      obj.commentId = new Types.ObjectId(commentId);
    }
    const post: PostType = await postHelper.findOne(
      { _id: new Types.ObjectId(postId) },
      "user"
    );
    if (!post) {
      return global.sendResponse(res, 400, false, "post not found.");
    }

    const comment = await commentHelper.insertOne(obj);
    const commentNoti = await settingHelper.get(
      new Types.ObjectId(post.user.toString())
    );
    if (
      req.user._id.toString() !== post.user.toString() &&
      commentNoti.comment
    ) {
      const notificationObj: NotificationType = {
        sender: new Types.ObjectId(req.user._id),
        receiver: post.user,
        itemId: new Types.ObjectId(postId),
        text: "comment on your post.",
        type: "comment",
      };
      await pushNotification(
        `Comment`,
        `${req.user.username} comment on your post.`,
        {
          _id: comment._id.toString(),
          type: "COMMENT",
        },
        [post.user.toString()]
      );
      await notificationHelper.insertOne(notificationObj);
    }
    return global.sendResponse(
      res,
      201,
      true,
      "Comment add successfully.",
      comment
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

export async function getCommentByPostId(req: Request, res: Response) {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const comment = await commentHelper.getCommentByPostId(
      postId,
      new Types.ObjectId(req.user._id),
      startIndex,
      limit
    );
    const pages = Math.ceil(comment[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;
    return global.sendResponse(res, 200, true, "Get comment successfully.", {
      comment: comment[0].data,
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

export async function getSubCommentByCommentId(req: Request, res: Response) {
  try {
    const commentId = new Types.ObjectId(req.params.id);
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const comment = await commentHelper.getSubCommentByCommentId(
      commentId,
      new Types.ObjectId(req.user._id),
      startIndex,
      limit
    );
    const pages = Math.ceil(comment[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;

    return global.sendResponse(res, 200, true, "Get comment successfully.", {
      comment: comment[0].data,
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

// ========================================================== End Comemnt Flow ==========================================================
