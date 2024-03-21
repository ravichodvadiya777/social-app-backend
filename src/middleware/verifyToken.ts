import { Request, Response, NextFunction } from 'express';
import jwt from  'jsonwebtoken';
import User, { UserRoles } from  '../model/userModel';



export function authenticateToken(req: Request, res: Response, next: NextFunction){
  if (!req.headers["authorization"]) {
    return global.sendResponse(res, 407, false, "Authentication Required.");
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err:Error, user) => {
      if (err) return global.sendResponse(res, 401, false, err.message);
      const existUser = await User.findById(user.id);
      if (!existUser) return global.sendResponse(res, 401, false, "User not found");
      
      req.user = existUser;
      // console.log(req.currentUser);
      next();
    });
  } else next();
}

// Grant access to specific roles with admin / user / employee
export function auth(roles: UserRoles[]){
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role
        if (role && !roles.includes(role)) {
      return next(global.sendResponse(res, 403, false, `User role ${req?.user?.role} is not authorized to access this route`));
    }
    next();
  };
}
