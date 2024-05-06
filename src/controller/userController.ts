import { Request, Response } from "express";
import RefreshToken from "../model/refreshTokensModel";
import { fileUploading } from "../middleware/fileUploading";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userHelper from "../db/userHelper";
import { Types } from "mongoose";
import postHelper from "../db/postHelper";
import followHelper from "../db/followHelper";
import Post from "../model/postModel";
import commentHelper from "../db/commentHelper";
import likeHelper from "../db/likeHelper";
import settingHelper from "../db/settingHelper";

const fieldNames: string[] = ["name", "dob", "email", "bio", "country", "city", "address", "pincode", "username"];

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
    await settingHelper.insertOne(new Types.ObjectId(addData._id));
    return global.sendResponse(res, 201, true, "User add successfully.", addData);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
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
      if (!user.active) return global.sendResponse(res, 401, false, "User is not active");

      const accessToken: string = await user.generateAuthToken(process.env.JWT_EXPIRE_IN); // 5 mini

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
      } else {
        await RefreshToken.findByIdAndUpdate(alreadyRefreshToken._id, {
          token: refreshToken,
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
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// token verify
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
    return global.sendResponse(res, 400, false, "Invalid token. Please try logging in again.", { key: "logout" });
  }
}
// ========================================================== End User Authentication Flow ==========================================================

// ========================================================== Start User Profile Flow ==========================================================

// Get user Profile
export async function getUserProfile(req: Request, res: Response) {
  try {
    let userId = req.params.id;
    if (!userId) {
      if (req.user) {
        userId = req.user._id;
      }
    }

    // const user = await userHelper.findOne({ _id : new Types.ObjectId(userId) });
    const user = await userHelper.getUserProfile(new Types.ObjectId(userId), new Types.ObjectId(req.user._id));
    return global.sendResponse(res, 200, true, "Get user profile.", user[0]);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// edit user profile
export async function editUserProfile(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    if (req.user) {
      if (userId !== req.user._id.toString()) {
        return global.sendResponse(res, 403, false, "Not authorized to access this route.");
      }
    }
    fieldNames.forEach((field) => {
      if (req.body[field] != null && req.user) req.user[field] = req.body[field];
    });

    if (req.files) {
      req.user.profileImg = await fileUploading(req.files.profileImg);
    }

    await userHelper
      .updateOne({ _id: userId }, req.user)
      .then(async () => {
        const user = await userHelper.findOne({
          _id: new Types.ObjectId(userId),
        });
        // delete user.password;
        return global.sendResponse(res, 200, true, "Edit success!", user);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// change password
export async function changePassword(req: Request, res: Response) {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await userHelper.findOne({ _id: new Types.ObjectId(req.user._id) }, "+password");

    //Checking old password is correct or not
    const checkOldPass = await bcrypt.compare(oldPassword, user.password);

    if (!checkOldPass) {
      return global.sendResponse(res, 401, false, "Wrong current password");
    }

    //Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword || null, 10);

    //Update the new password to database
    await userHelper.updateOne({ _id: userId }, { password: hashedPassword });
    return global.sendResponse(res, 200, true, "Password has been changed successfully.");
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// check user name uniq or not
export async function chekUserName(req: Request, res: Response) {
  try {
    const username = req.query.username.toString();

    const user = await userHelper.findOne({ username: username });
    if (user) {
      return global.sendResponse(res, 200, true, "Username already exists.", {
        username: false,
      });
    }
    return global.sendResponse(res, 200, true, "Ok.", { username: true });
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// search by user name
export async function searchByUserName(req: Request, res: Response) {
  try {
    let users = await userHelper.find({ username: { $regex: req.body.username, $options: "i" } }, "username profileImg name");
    if (!req.body.username) {
      users = [];
    }
    return global.sendResponse(res, 200, true, "Search Successfully", users);
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}

// delete account
export async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    await userHelper.delete({ _id: userId });
    // delete post
    // remove post
    const postIds = (await Post.find({ user: userId }).select("_id")).map((post) => post._id);
    // delete post comments
    await commentHelper.deleteMany({ postId: { $in: postIds } });
    // delete post likes
    await likeHelper.deleteMany({ postId: { $in: postIds } });
    await postHelper.deleteMany({ user: userId });

    // remove follower tab and following tab
    await followHelper.deleteMany({
      $or: [{ user: userId }, { follow: userId }],
    });

    // remove notification pending
    return global.sendResponse(res, 200, true, "Account deleted successfully.");
  } catch (error) {
    console.log(error);
    return global.sendResponse(res, 400, false, "Something not right, please try again.");
  }
}
// ========================================================== End User Profile Flow ==========================================================
