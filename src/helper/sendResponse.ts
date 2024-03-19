
import { Response } from "express";

global.sendResponse = function(res:Response ,code:number,flag: boolean, message: string, data?: object): void {
    // console.log(`Argument 1: ${arg1}, Argument 2: ${arg2}`);
    let statusCode = code;
    let responseStatus = flag;
    let responseMessage = message;
    let responseData = data;
    console.log('hello');
    
    res.status(code).json({
        code: statusCode,
        success: responseStatus,
        message: responseMessage,
        data: responseData,
    });
};