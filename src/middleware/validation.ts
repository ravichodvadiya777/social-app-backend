import {validationResult} from "express-validator";

export const validationSchema = (req, res, next) => { 
    const errors = validationResult(req);
    
    // check for param errors
    if (!errors.isEmpty()) {
        return global.sendResponse(res, 400, false, "Required params not found.", {
            errors: errors.array(),
        });
    }
    next()
}