// /* eslint-disable no-unused-vars */
import { Types } from "mongoose";
import { UserType } from "../model/userModel";

declare global {
  type SendResponse = (
    res: Response,
    code: number,
    flag: boolean,
    message: string,
    data?: object
  ) => void;
  // let sendResponse: SendResponse;
  namespace NodeJS {
    interface Global {
      sendResponse: SendResponse;
    }
  }

  namespace Express {
    interface Request {
      user?: UserType;
      files?: {
        profileImg: string;
        file?: object | object[];
        story?: undefined;
      };
    }
    interface Response {
      record?: {
        postId: number;
        user?: Document;
        photos?: { url: string; type: string }[];
        _id?: Types.ObjectId;
      };
    }
  }
}

export {};
