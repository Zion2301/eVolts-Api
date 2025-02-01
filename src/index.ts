import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS
import evotlRouter from "./routes/evotlRoutes";

dotenv.config();
const app = express();

// Enable CORS for all origins (for development purposes)
const corsOptions = {
  origin: 'http://localhost:5173',  // Replace with your frontend URL if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow methods as needed
  allowedHeaders: ['Content-Type'],  // Allow headers as needed
};

app.use(cors(corsOptions));  // Apply CORS globally

app.use(express.json());
app.use("/api/evtols", evotlRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


