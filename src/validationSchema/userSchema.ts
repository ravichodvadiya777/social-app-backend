import { check } from "express-validator"


const Schema = {

    addUser : [
        check("name").notEmpty().withMessage("Name is a required field"),
        check("username").notEmpty().withMessage("Username is a required field"),
        check("email")
            .notEmpty()
            .withMessage("Email is a required field")
            .isLength({ min: 3, max: 84 })
            .isEmail()
            .withMessage("Enter an valid email address"),
        check("password").notEmpty().withMessage("Password is a required field"),
    ],

    login : [
        check("email")
            .notEmpty()
            .withMessage("Email is a required field")
            .isLength({ min: 3, max: 84 })
            .isEmail()
            .withMessage("Enter an valid email address"),
        check("password").notEmpty().withMessage("Password is a required field"),
    ],

    editUserProfile : [
        check("name").notEmpty().withMessage("Name is a required field"),
        check("email")
            .notEmpty()
            .withMessage("Email is a required field")
            .isLength({ min: 3, max: 84 })
            .isEmail()
            .withMessage("Enter an valid email address"),
    ]
};


export default Schema;

