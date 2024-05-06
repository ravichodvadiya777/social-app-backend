import { Request, Response } from "express";
import settingHelper from "../db/settingHelper";
import { Types } from "mongoose";

export async function getSetting(req: Request, res: Response) {
  try {
    const setting = await settingHelper.get(new Types.ObjectId(req.user._id));
    return global.sendResponse(res, 200, true, "Setting get successfully.", setting);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

export async function editSetting(req: Request, res: Response) {
  try {
    const setting = await settingHelper.patch(new Types.ObjectId(req.user._id), req.body);
    return global.sendResponse(res, 200, true, "Setting update successfully.", setting);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}
