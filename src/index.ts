import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // Import CORS
import evotlRouter from "./routes/evotlRoutes";
// import bodyParser from "body-parser"

dotenv.config();
const app = express();

// Enable CORS for all origins (for development purposes)
app.use(cors());

// If you want to restrict it to a specific origin (like your frontend)
// Configure the CORS middleware with specific options
app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend URL if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

app.use(express.json());
// app.use(bodyParser.json());
app.use("/api/evtols", evotlRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

