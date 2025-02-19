import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, generateJWT } from "../utils/auth.utils";

const prisma = new PrismaClient();

// User registration
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);

    // Check if the user is an admin
    const isAdmin = email === "admin@gmail.com" && password === "admin";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin, // Store admin status in DB
      },
    });

    const token = generateJWT(user.id, user.isAdmin); // Include isAdmin in JWT
    return res.status(201).json({ user, token, isAdmin });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Ensure admin login always gets isAdmin = true
    const isAdmin = email === "admin@gmail.com" && password === "admin" ? true : user.isAdmin;

    const token = generateJWT(user.id, isAdmin);
    return res.status(200).json({ user, token, isAdmin });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
