import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File & { secure_url?: string }; // Extend the file object with secure_url
    }
  }
}
