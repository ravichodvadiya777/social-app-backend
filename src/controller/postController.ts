import { Request, Response } from "express";
import postHelper from "../db/postHelper";
import { Types } from "mongoose";
import { fileUploading } from "../middleware/fileUploading";

// Post edit field
const postFieldName: string[] = ["title", "description", "photos"];

// ========================================================== Start Post Flow ==========================================================
export async function createPost(req: Request, res: Response) {
  try {
    const { description }: { description: string } = req.body;
    const mention = req.body.mention.split(",");
    if (!req.user) {
      return global.sendResponse(
        res,
        403,
        false,
        "Not authorized to access this route."
      );
    }

    const media: { url: string; type: string }[] = [];
    if (req.files) {
      let photos: object | object[] | undefined = req.files.file
        ? req.files.file
        : undefined;

      if (!Array.isArray(photos)) {
        photos = [photos];
      }
      if (Array.isArray(photos)) {
        for (const file of photos) {
          const path = await fileUploading(file);
          media.push({
            url: path as string,
            type: file.mimetype.split("/")[0] as string,
          });
        }
      }
    }

    const obj = {
      user: req.user._id,
      description: description,
      photos: media,
      mention: mention && mention.length > 0 ? mention : undefined,
    };
    const post = await postHelper.insertOne(obj);
    return global.sendResponse(
      res,
      201,
      true,
      "Post create successfully.",
      post
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

export async function getPostById(req: Request, res: Response) {
  try {
    const postId = new Types.ObjectId(req.params.id);
    // console.log(postId);
    const post = await postHelper.findOne({ _id: postId });
    return global.sendResponse(res, 200, true, "Get Post successfully.", post);
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

export async function getAllPost(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const post = await postHelper.getAllPost(
      new Types.ObjectId(req.user._id),
      startIndex,
      limit
    );

    const pages = Math.ceil(post[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;

    return global.sendResponse(res, 200, true, "Get Post successfully.", {
      post: post[0].data,
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

export async function editPost(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    if (!res.record?.user || !req.user?._id) {
      return global.sendResponse(
        res,
        403,
        false,
        "Not authorized to access this route."
      );
    }
    if (res.record?.user.toString() !== req.user._id.toString()) {
      return global.sendResponse(
        res,
        403,
        false,
        "Not authorized to access this route."
      );
    }

    postFieldName.forEach((field) => {
      if (req.body[field] != null && res.record)
        res.record[field] = req.body[field];
    });

    // await Post.updateOne({ _id: postId }, res.record, { new: true })
    await postHelper.updateOne({ _id: postId }, res.record);
    return global.sendResponse(res, 200, true, "Edit success!");
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

export async function deletePost(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    if (res.record?.user && req.user) {
      if (res.record.user.toString() !== req.user._id.toString()) {
        return global.sendResponse(
          res,
          403,
          false,
          "Not authorized to access this route."
        );
      }
    }
    // await Post.findByIdAndDelete(postId);
    await postHelper.deleteOne({ _id: new Types.ObjectId(postId) });
    return global.sendResponse(res, 200, true, "Deleted Successfully");
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

export async function getPostByUserId(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.params.id);
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const startIndex = page * limit;

    const postList = await postHelper.getPostByUserId(
      { user: userId },
      startIndex,
      limit
    );

    const pages = Math.ceil(postList[0].totalRecord / limit);
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 0;

    return global.sendResponse(res, 200, true, "Get post Successfully", {
      post: postList[0].data,
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
// ========================================================== End Post Flow ==========================================================
