import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword, generateJWT } from "../utils/auth.utils";

const prisma = new PrismaClient()
// User registration
export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;
    try {
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await hashPassword(password);
  
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
  
      const token = generateJWT(user.id);
      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error });
    }
  };
  
  export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = generateJWT(user.id);
      return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong", error });
    }
  };