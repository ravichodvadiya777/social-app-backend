import { Response } from "express";

global.sendResponse = function (
  res: Response,
  code: number,
  flag: boolean,
  message: string,
  data?: object
) {
  // console.log(`Argument 1: ${arg1}, Argument 2: ${arg2}`);
  res.status(code).json({
    code: code,
    success: flag,
    message: message,
    data: data,
  });
};
