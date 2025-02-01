import express from "express";
import dotenv from "dotenv";
import evotlRouter from "./routes/evotlRoutes";

dotenv.config();
const app = express();

// Manually set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');  // Your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allow methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allow headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');  // Allow credentials (cookies, etc.)
  next();  // Proceed to the next middleware
});

app.use(express.json());
app.use("/api/evtols", evotlRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});


