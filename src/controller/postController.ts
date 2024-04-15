import { Request, Response } from "express";
// import Post from "../model/postModel";
import postHelper from "../db/postHelper";
import { Types } from "mongoose";
import { fileUploading } from "../middleware/fileUploading";

// Post edit field
const postFieldName: string[] = ["title", "description", "photos"];

// ========================================================== Start Post Flow ==========================================================
export async function createPost(req: Request, res: Response) {
  try {
    const {
      description,
      mention,
    }: { description: string; mention: string[] } = req.body;
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
    const { options } = req.body;
    const page = options?.page + 1 || 1;
    const limit = options?.sizePerPage || 10;
    const column_name = options?.sort || "_id";
    const OrderBy = options?.order == "ASC" ? 1 : -1;
    const startIndex = (page - 1) * limit;
    const sortData = options ? { [column_name]: OrderBy } : 0;
    
    const post = await postHelper.getAllPost(new Types.ObjectId(req.user._id),options, sortData, startIndex, limit);
    
    return global.sendResponse(res, 200, true, "Get Post successfully.", post[0]);
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
    await postHelper.delete({ _id: new Types.ObjectId(postId) });
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
    
    const postList = await postHelper.getPostByUserId({user : userId});
    
    return global.sendResponse(res, 200, true, "Get post Successfully", postList);
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