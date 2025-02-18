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
// User registration
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExists = yield prisma.user.findUnique({ where: { email } });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield (0, auth_utils_1.hashPassword)(password);
        // Check if the user is an admin
        const isAdmin = email === "admin@gmail.com" && password === "admin";
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                isAdmin, // Store admin status in DB
            },
        });
        const token = (0, auth_utils_1.generateJWT)(user.id, user.isAdmin); // Include isAdmin in JWT
        return res.status(201).json({ user, token, isAdmin });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});
exports.register = register;
// User login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const isMatch = yield (0, auth_utils_1.comparePassword)(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Ensure admin login always gets isAdmin = true
        const isAdmin = email === "admin@gmail.com" && password === "admin" ? true : user.isAdmin;
        const token = (0, auth_utils_1.generateJWT)(user.id, isAdmin);
        return res.status(200).json({ user, token, isAdmin });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});
exports.login = login;
