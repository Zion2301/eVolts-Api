"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Authentication middleware
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        console.log("🔴 No token provided");
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
        if (!process.env.JWT_SECRET) {
            console.log("🔴 JWT_SECRET is not defined");
            res.status(500).json({ message: "Server error: JWT_SECRET not found" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        console.log("🟢 Authenticated User:", req.userId, "| isAdmin:", req.isAdmin);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.log("🔴 Token expired");
            res.status(401).json({ message: "Token expired." });
            return;
        }
        console.log("🔴 Invalid token:", error);
        res.status(400).json({ message: "Invalid token." });
    }
};
exports.authenticate = authenticate;
// Admin check middleware
const isAdmin = (req, res, next) => {
    console.log("🔍 Checking Admin Status:", req.isAdmin);
    if (req.isAdmin === undefined || !req.isAdmin) {
        console.log("🔴 Access Denied: User is not an admin");
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    console.log("🟢 Admin Verified");
    next();
};
exports.isAdmin = isAdmin;
