"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const auth_utils_1 = require("../utils/auth.utils");
const prisma = new client_1.PrismaClient();
// User Registration
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log("Incoming request body:", req.body); // ✅ Add this line
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield (0, auth_utils_1.hashPassword)(password);
        const isAdmin = email === "admin@gmail.com" && password === "admin";
        console.log("Data being sent to Prisma:", { name, email, password: hashedPassword, isAdmin });
        const user = yield prisma.user.create({
            data: { name, email, password: hashedPassword, isAdmin },
        });
        console.log("User created successfully:", user);
        const token = (0, auth_utils_1.generateJWT)(user.id, user.isAdmin);
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
            token,
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.register = register;
// User Login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = yield (0, auth_utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isAdmin = email === "admin@gmail.com" && password === "admin" ? true : user.isAdmin;
        const token = (0, auth_utils_1.generateJWT)(user.id, isAdmin);
        return res.status(200).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, isAdmin: isAdmin },
            token,
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.login = login;
