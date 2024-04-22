import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserRoles } from "../model/userModel";
import RefreshToken from "../model/refreshTokensModel";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["authorization"]) {
    return global.sendResponse(res, 407, false, "Authentication Required.");
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err: Error, user) => {
      if (err) return global.sendResponse(res, 401, false, err.message);
      const existUser = await User.findById(user.id);
      if (!existUser)
        return global.sendResponse(res, 401, false, "User not found");

      req.user = existUser;
      next();
    });
  } else next();
}

// Grant access to specific roles with admin / user / employee
export function auth(roles: UserRoles[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (role && !roles.includes(role)) {
      return next(
        global.sendResponse(
          res,
          403,
          false,
          `User role ${req?.user?.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
}

// Generate token using refreshToken
export async function refreshToken(token: string, res: Response) {
  const checkToken = await RefreshToken.findOne({
    token: token,
  });
  if (!checkToken) {
    return global.sendResponse(
      res,
      400,
      false,
      "Your session expired, try to login.",
      { key: "logout" }
    );
  }
  const existUser = await User.findById(checkToken.user);
  if (!existUser) {
    return global.sendResponse(res, 401, false, "User not found");
  }
  const accessToken: string = await existUser.generateAuthToken(
    process.env.JWT_EXPIRE_IN
  ); // 5 mini

  global.sendResponse(res, 200, false, "Generate refresh token.", {
    accessToken,
  });
}
