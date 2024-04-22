import { check } from "express-validator";

const Schema = {
  follow: [
    check("follow").notEmpty().withMessage("Follow is a required field"),
  ],

  unfollow: [
    check("follow").notEmpty().withMessage("Follow is a required field"),
  ],
};

export default Schema;
