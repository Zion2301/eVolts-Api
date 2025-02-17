import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

// Hash password
const JWT_SECRET = process.env.JWT_SECRET as string;
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT
export const generateJWT = (userId: number, isAdmin: Boolean) => {
  return jwt.sign({ userId, isAdmin }, JWT_SECRET, { expiresIn: "1d" });
};

// Verify JWT
export const verifyJWT = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};