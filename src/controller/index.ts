import { Request, Response } from "express";

export function home(req:Request, res:Response):void {
    res.json({hello : 'test'})
    return;
}

export const auth = (req:Request, res:Response):void => {
    res.json({auth : "okkk"})
    return;
}   