import { Request, Response } from "express";
import RefreshToken from "../model/refreshTokensModel";
import { fileUploading } from "../middleware/fileUploading";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userHelper from "../db/userHelper";
import { Types } from "mongoose";

const fieldNames: string[] = ["name", "dob", "email", "bio", "country", "city", "address", "pincode"];

// ========================================================== Start User Authentication Flow ==========================================================
export async function addUser(req: Request, res: Response) {
  try {
    const email: string = req.body.email;
    const checkUser = await userHelper.findOne({ email: email });
    if (checkUser) {
      return global.sendResponse(res, 409, false, "Email already in use.");
    }
    req.body.password = await bcrypt.hash(req.body.password || null, 10);
    const addData = await userHelper.insertOne(req.body);
    return global.sendResponse(
      res,
      201,
      true,
      "User add successfully.",
      addData
    );
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await userHelper.findOne({ email: email }, "+password");
    if (!user) {
      return global.sendResponse(res, 404, false, "Invalid email");
    } else if (!(await bcrypt.compare(password, user.password))) {
      return global.sendResponse(res, 401, false, "Incorrect password");
    } else {
      user.password = undefined;
      const accessToken: string = await user.generateAuthToken(
        process.env.JWT_EXPIRE_IN
      ); // 5 mini
      const refreshToken: string = await user.generateAuthToken(); // main
      if (user._doc) {
        user._doc.accessToken = accessToken;
      }
      const alreadyRefreshToken = await RefreshToken.findOne({
        user: user._id,
      });
      if (!alreadyRefreshToken) {
        await RefreshToken.create({
          token: refreshToken,
          user: user._id,
        });
      }
      res.cookie("App", refreshToken, {
        httpOnly: true,
        secure: false, // Temporarily for local development
        sameSite: "lax", // Can use "lax" for local development if not testing cross-site requests
        maxAge: 24 * 60 * 60 * 1000,
      });
      return global.sendResponse(res, 200, true, "Login successfully", user);
    }
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const token: string = req.body.token;
    if (!token) {
      return global.sendResponse(res, 401, false, "No token provided.");
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    return global.sendResponse(res, 200, true, "Ok.");
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Invalid token. Please try logging in again.",
      { key: "logout" }
    );
  }
}
// ========================================================== End User Authentication Flow ==========================================================

// ========================================================== Start User Profile Flow ==========================================================

export async function getUserProfile(req: Request, res: Response) {
  try {
    let userId = req.params.id;
    if (!userId) {
      if (req.user) {
        userId = req.user._id;
      }
    }

    const user = await userHelper.findOne({ _id : new Types.ObjectId(userId) });
    return global.sendResponse(res, 200, true, "Get user profile.", user);
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}

export async function editUserProfile(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    if (req.user) {
      if (userId !== req.user._id.toString()) {
        return global.sendResponse(
          res,
          403,
          false,
          "Not authorized to access this route."
        );
      }
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null && req.user)
        req.user[field] = req.body[field];
    });

    if (req.files) {
      req.user.profileImg = await fileUploading(req.files.profileImg);
    }

    await userHelper
      .updateOne({ _id: userId }, req.user)
      .then(async() => {
        const user = await userHelper.findOne({_id : new Types.ObjectId(userId)});
        // delete user.password;
        return global.sendResponse(res, 200, true, "Edit success!", user);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}


export async function changePassword(req: Request, res: Response) {
  try {
    console.log("innnn")
    const {oldPassword, newPassword} = req.body;
    const userId = req.user._id;
    
    const user = await userHelper.findOne({ _id: new Types.ObjectId(req.user._id) }, "+password");
    
    //Checking old password is correct or not
    const checkOldPass = await bcrypt.compare(oldPassword, user.password);
    
    if (!checkOldPass) {
      return global.sendResponse(res, 401, false, 'Wrong current Password');
    }

    //Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword || null, 10);

    //Update the new password to database
    await userHelper.updateOne({_id : userId},{password : hashedPassword})
    return global.sendResponse(res,200, true,'Password has been changed successfully.');

  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}


export async function chekUserName(req: Request, res: Response) {
  try {
    const userName = req.query.userName.toString();
    
    const user = await userHelper.findOne({username : userName});
    if(user){
      return global.sendResponse(res,409,"Username already exists.",{userName : false})  
    }
    return global.sendResponse(res,200,"Ok.",{userName : true});
  } catch (error) {
    console.log(error);
    return global.sendResponse(
      res,
      400,
      false,
      "Something not right, please try again."
    );
  }
}
// ========================================================== End User Profile Flow ==========================================================