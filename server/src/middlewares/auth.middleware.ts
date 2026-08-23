import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/Apperror.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET){
  throw new Error("JWT is not defined");
}

export interface AuthRequest extends Request {
  userId?: number;
}

interface JwtPayload {
  userId: number;
}
 
export function authMiddleware( req: AuthRequest, res: Response, next: NextFunction ) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication Error", 401);
    }
    const token = authHeader.split(" ")[1] as string;
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    req.userId = decoded.userId ;
    next();
  } catch (err) {
    next(err);
  }
}
