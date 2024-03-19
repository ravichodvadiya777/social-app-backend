import { Request, Response, NextFunction } from 'express';
import jwt from  'jsonwebtoken';
import User from  '../model/userModel';



exports.authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers["authorization"]) {
    return res.status(407).send({ message: "Authentication Required." });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err:Error, user) => {
      if (err) return res.status(401).send({ message: err.message });
      const existUser = await User.findById(user.id);
      if (!existUser)return res.status(401).send({ message: "User not found." });
      
      req.currentUser = existUser;
      // console.log(req.currentUser);
      next();
    });
  } else next();
};

// Grant access to specific roles with admin / user / employee
exports.auth = (...roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(
        res.status(403).json({
          message: `User role ${req.currentUser.role} is not authorized to access this route`,
        })
      );
    }
    next();
  };
};
