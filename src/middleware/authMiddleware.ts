import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: number;
  isAdmin?: boolean; // New property to store admin status
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; isAdmin: boolean };

    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin; // Attach admin status to the request

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to restrict access to admins only
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.isAdmin) {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }
    next();
  };