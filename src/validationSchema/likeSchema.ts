import { check } from "express-validator"


const Schema = {

    addLike : [
        check("postId").notEmpty().withMessage("PostId is a required field"),
        check("type").notEmpty().withMessage("Type is rquired field")
    ],
};


export default Schema;

