import { NextFunction,Request,Response } from "express";
import { Model } from "mongoose";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRecord = (Model:Model<any>) => { 
    
      return async (req:Request, res: Response, next: NextFunction) => {
        let record;
        try {
            // console.log(req.params.id);
          record = await Model.findById(req.params.id);
          if (record == null)
          return global.sendResponse(res, 404, false,"Cannot find record");
        } catch (error) {
          return global.sendResponse(res, 500, false, error.message);
        }
        res.record = record;
        next();
      };
}
  