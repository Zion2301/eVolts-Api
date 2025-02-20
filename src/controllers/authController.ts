import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, generateJWT } from "../utils/auth.utils";

const prisma = new PrismaClient();

// User Registration
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Incoming request body:", req.body); // ✅ Add this line

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const isAdmin = email === "admin@gmail.com" && password === "admin";

    console.log("Data being sent to Prisma:", { name, email, password: hashedPassword, isAdmin });

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, isAdmin },
    });

    console.log("User created successfully:", user);

    const token = generateJWT(user.id, user.isAdmin);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// User Login
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isAdmin = email === "admin@gmail.com" && password === "admin" ? true : user.isAdmin;
    const token = generateJWT(user.id, isAdmin);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, isAdmin: isAdmin },
      token,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
