// /* eslint-disable no-unused-vars */
import { UserType } from "../model/userModel";

declare global {
    namespace NodeJS {
        interface Global {
          status?: UserType,
          sendResponse: (res:string ,code: number,flag: boolean, message: string, data?: object) => void;
        }
    }

    namespace Express {
      interface Request {
        currentUser?: UserType;
      }
    }
  }

export {};
  