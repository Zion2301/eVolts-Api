import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Extended Request type to hold authenticated user data
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    isAdmin: boolean;
  };
}

// Authentication middleware
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  console.log("🔍 Authentication Middleware Executing...");

  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🔴 No valid Authorization header found");
     res.status(401).json({ message: "Access denied. No token provided." });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🔍 Verifying Token:", token);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log("❌ Server Error: JWT_SECRET is missing!");
       res.status(500).json({ message: "Internal server error: Missing JWT_SECRET." });
       return
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: number; isAdmin: boolean };
    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };

    console.log("🟢 Authenticated User:", req.user);
    next();
  } catch (error) {
    console.log("🔴 Authentication Error:", error);
     res.status(401).json({ message: "Invalid or expired token." });
     return
  }
};

// Admin check middleware
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  console.log("🔍 Checking Admin Status...");

  if (!req.user || !req.user.isAdmin) {
    console.log("🔴 Access Denied: User is not an admin");
     res.status(403).json({ message: "Access denied. Admins only." });
     return
  }

  console.log("🟢 Admin Verified:", req.user.userId);
  next();
};
