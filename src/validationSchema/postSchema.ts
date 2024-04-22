import { check, param } from "express-validator";

const Schema = {
  // createPost : [
  //     check("title").notEmpty().withMessage("Title is a required field"),
  //     check("photos").notEmpty().withMessage("Photos is a required field"),
  // ],

  getPostById: [param("id").notEmpty().withMessage("id is a required field")],

  editPost: [
    param("id").notEmpty().withMessage("id is a required field"),
    check("title").notEmpty().withMessage("Title is a required field"),
    check("photos").notEmpty().withMessage("Photos is a required field"),
  ],

  deletePost: [param("id").notEmpty().withMessage("id is a required field")],

  getPostByUserId: [
    param("id").notEmpty().withMessage("id is a required field"),
  ],
};

export default Schema;
