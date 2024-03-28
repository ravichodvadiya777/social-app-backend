// /* eslint-disable no-unused-vars */
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
  namespace NodeJS{
    interface Global{
      sendResponse: SendResponse
    }
  }

  namespace Express {
     interface Request {
      user?: UserType,
      files?: {
        file? :  object | object[]
      }
    }
    interface Response {
      record?: {
        postId: number;
        user? : Document,
        photos? : string[]
      }
    }
  }

}

export {};