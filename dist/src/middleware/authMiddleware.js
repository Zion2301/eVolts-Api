"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
// Ensure JWT secret is available
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
// Authentication middleware
const authenticate = (req, res, next) => {
    console.log("🔍 Authentication Middleware Executing...");
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("🔴 No valid Authorization header found");
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        console.log("🔍 Verifying Token:", token);
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        console.log("🟢 Authenticated:", req.userId, "| isAdmin:", req.isAdmin);
        next();
    }
    catch (error) {
        console.log("🔴 Authentication Error:", error);
        res.status(400).json({ message: "Invalid token." });
        return;
    }
};
exports.authenticate = authenticate;
// Admin check middleware
const isAdmin = (req, res, next) => {
    console.log("🔍 Checking Admin Status:", req.isAdmin);
    if (!req.isAdmin) {
        console.log("🔴 Access Denied: User is not an admin");
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    console.log("🟢 Admin Verified");
    next();
};
exports.isAdmin = isAdmin;
