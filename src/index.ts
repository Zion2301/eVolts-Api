import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS
import evotlRouter from "./routes/evotlRoutes";
import authrouter from "./routes/authRoutes";

dotenv.config();
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',  // Local frontend URL during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true  // Allow credentials (cookies, auth tokens)
}));

app.use(express.json());
app.use("/api/evtols", evotlRouter);
app.use("/api/auth", authrouter)

const PORT = process.env.PORT || 5000;  

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});


