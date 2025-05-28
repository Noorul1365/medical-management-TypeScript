import adminModel from '../models/admin';
import userModel from '../models/user';
import asyncHandler from '../utils/errorHandler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    admin_id: string;
    admin_role: string;
    user_id: string;
    user_role: string;
}

declare global {
    namespace Express {
      interface Request {
        adminID?: string;
        adminRole?: string;
        userID?: string;
        userRole?: string;
      }
    }
}

export const isAdminLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;

    if(!token){
        return res.status(400).json({ code: 400, success: false, message: "No token provided" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decodedToken = jwt.verify(token, jwtSecret) as DecodedToken; 

    if (!decodedToken) {
      return res.status(400).send({ code: 400, message: "Failed to authenticate token" });
    }

    if (!decodedToken.admin_id) {
        return res.status(400).send({
          code: 400,
          message: "Cannot find admin_id in decoded token",
        });
    }

    const foundAdmin = await adminModel.findById(decodedToken.admin_id);

    if (!foundAdmin) {
      return res.status(400).send({ code: 400, message: "Admin not found" });
    }

    req.adminID = decodedToken.admin_id;
    req.adminRole = decodedToken.admin_role;
    next();
})

export const isUserLoggedIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization;

  if(!token){
      return res.status(400).json({ code: 400, success: false, message: "No token provided" });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const decodedToken = jwt.verify(token, jwtSecret) as DecodedToken; 

  if (!decodedToken) {
    return res.status(400).send({ code: 400, message: "Failed to authenticate token" });
  }

  if (!decodedToken.user_id) {
      return res.status(400).send({
        code: 400,
        message: "Cannot find admin_id in decoded token",
      });
  }

  const foundUser = await userModel.findById(decodedToken.user_id);

  if (!foundUser) {
    return res.status(400).send({ code: 400, message: "User not found" });
  }

  req.userID = decodedToken.user_id;
  req.userRole = decodedToken.user_role;
  next();
})