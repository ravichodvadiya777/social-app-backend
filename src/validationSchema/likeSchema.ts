import { check, param } from "express-validator"


const Schema = {

    addLike : [
        check("postId").notEmpty().withMessage("PostId is a required field"),
        check("type").notEmpty().withMessage("Type is rquired field")
    ],
    
    unlike : [
        param("id").notEmpty().withMessage("id is a required field"),
    ],
    
    getLikeById : [
        param("id").notEmpty().withMessage("id is a required field"),
    ],
};


export default Schema;

