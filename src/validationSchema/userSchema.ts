import { check, param, query } from "express-validator"


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
        param("id").notEmpty().withMessage("id is a required field"),
        check("name").notEmpty().withMessage("Name is a required field"),
        // check("email")
        //     .notEmpty()
        //     .withMessage("Email is a required field")
        //     .isLength({ min: 3, max: 84 })
        //     .isEmail()
        //     .withMessage("Enter an valid email address"),
    ],

    getUserProfile : [
        param("id").notEmpty().withMessage("Id is a required field"),
    ],

    changePassword : [
        check("oldPassword").notEmpty().withMessage("Old password is a required field"),
        check("newPassword").notEmpty().withMessage("New password is a required field"),
    ],

    chekUserName : [
        query("userName").notEmpty().withMessage("UserName is a required field"),
    ]

};


export default Schema;

