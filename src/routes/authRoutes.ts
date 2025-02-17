import { Router } from "express";
import { Request, Response } from "express";
import { register, login } from "../controllers/authController";

const authrouter = Router();

authrouter.post('/signup', async (req: Request, res: Response) => {
    await register(req, res);
  });
  
  authrouter.post('/login', async (req: Request, res: Response) => {
    await login(req, res);
  });

export default authrouter;
