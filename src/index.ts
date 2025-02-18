import express from "express";
import dotenv from "dotenv";
import cors from "cors";  
import evotlRouter from "./routes/evotlRoutes";
import authrouter from "./routes/authRoutes";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();
const app = express();

// ✅ CORS before routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// // ✅ Global Debugging Middleware - Logs Every Request
// app.use((req, res, next) => {
//   console.log(`🌍 [${req.method}] ${req.path}`);
//   console.log("🔹 Headers:", req.headers);
//   next();
// });

// // ✅ Debug: Ensure middleware isn't skipped
// app.use((req, res, next) => {
//   console.log("🚦 Middleware is running before routes...");
//   next();
// });

console.log("✅ evotlRoutes loaded!");
app.use("/api/evtols", authenticate, evotlRouter);
app.use("/api/auth", authrouter);

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
