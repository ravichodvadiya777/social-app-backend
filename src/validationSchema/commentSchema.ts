import { check } from "express-validator"


const Schema = {

    addComment : [
        check("postId").notEmpty().withMessage("PostId is a required field"),
        check("description").notEmpty().withMessage("Description is a required field"),
    ],
    
};


export default Schema;

