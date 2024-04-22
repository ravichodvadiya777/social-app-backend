import { Request, Response } from "express";
import storyHelper from "../db/storyHelper";
import { fileUploading } from "../middleware/fileUploading";
import { Types } from "mongoose";
import schedule from "node-schedule";

// Post edit field
// const postFieldName: string[] = ["title", "description", "photos"];

// ========================================================== Start story Flow ==========================================================
// get a story
export async function getStory(req: Request, res: Response) {
  try {
    const userId = new Types.ObjectId(req.user._id);
    const story = await storyHelper.getStory(userId);
    return global.sendResponse(
      res,
      200,
      true,
      "Get story successfully.",
      story
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

// create a story
export async function createStory(req: Request, res: Response) {
  try {
    let photos: object | undefined = req.files.story
      ? req.files.story
      : undefined;

    if (!Array.isArray(photos)) {
      photos = [photos];
    }
    const media: {
      user: Types.ObjectId;
      story: { url: string; type: string };
    }[] = [];
    let obj;

    if (Array.isArray(photos)) {
      for (const file of photos) {
        const path = await fileUploading(file);
        obj = {
          user: new Types.ObjectId(req.user._id),
          story: {
            url: path as string,
            type: file.mimetype.split("/")[0] as string,
          },
        };
        media.push(obj);
      }
    }

    const story = await storyHelper.insertOne(obj);

    // story end point
    const originalDate = new Date(story.createdAt);

    originalDate.setHours(originalDate.getHours() + 24);
    const expiryDate = originalDate.toISOString();

    const trend = story._id;
    schedule.scheduleJob(
      expiryDate,
      async function () {
        await storyHelper.deleteOne({ _id: new Types.ObjectId(story._id) });
      }.bind(null, trend)
    );

    return global.sendResponse(
      res,
      201,
      true,
      "Story create successfully.",
      story
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

// ========================================================== End story Flow ==========================================================
