import { Request, Response } from "express";
import notificationHelper from "../db/notificationHelper";
import { Types } from "mongoose";

export async function getNotification(req: Request, res: Response) {
  try {
    const limit = req.query.limit || 20;
    const page = req.query.page || 0;
    await notificationHelper.patch(new Types.ObjectId(req.user._id));
    const notification = await notificationHelper.get(new Types.ObjectId(req.user._id), Number(limit), Number(page));
    const pages = Math.ceil(notification[0].totalRecord / Number(limit));
    const hasNextPage = Number(page) < pages - 1;
    const hasPreviousPage = Number(page) > 1;
    return global.sendResponse(res, 200, true, "Notification get successfully.", { data: notification[0].data, hasNextPage, hasPreviousPage });
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

export async function getNotificationCount(req: Request, res: Response) {
  try {
    const notification = await notificationHelper.getCount(new Types.ObjectId(req.user._id));
    return global.sendResponse(res, 200, true, "Notification count get successfully.", notification);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}
