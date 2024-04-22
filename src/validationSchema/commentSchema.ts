import { check, param } from "express-validator";

const Schema = {
  addComment: [
    check("postId").notEmpty().withMessage("PostId is a required field"),
    check("description")
      .notEmpty()
      .withMessage("Description is a required field"),
  ],

  getCommentByPostId: [
    param("id")
      .notEmpty()
      .withMessage("id is a required field")
      .isMongoId()
      .withMessage("provide valid id")
      .isString()
      .withMessage("id must be a string")
      .isLength({ min: 24, max: 24 })
      .withMessage("id must be 24 characters long"),
  ],

  getSubCommentByCommentId: [
    param("id")
      .notEmpty()
      .withMessage("id is a required field")
      .isMongoId()
      .withMessage("provide valid id")
      .isString()
      .withMessage("id must be a string")
      .isLength({ min: 24, max: 24 })
      .withMessage("id must be 24 characters long"),
  ],
};

export default Schema;
