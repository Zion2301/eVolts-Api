import express from "express";
import dotenv from "dotenv";
import cors from "cors";  
import evotlRouter from "./routes/evotlRoutes";
import authrouter from "./routes/authRoutes";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();
const app = express();

// ✅ Enable CORS before routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Ensure JSON body parsing is enabled
app.use(express.json());

// ✅ Global Debugging Middleware - Logs Every Request
app.use((req, res, next) => {
  console.log(`🌍 [${req.method}] ${req.path}`);
  console.log("🔹 Headers:", req.headers);
  
  req.on("data", (chunk) => {
    console.log("📦 Body Chunk:", chunk.toString());
  });

  req.on("end", () => {
    console.log("📦 Body Parsing Completed");
  });

  next();
});

// ✅ Debug: Ensure middleware isn't skipped
app.use((req, res, next) => {
  console.log("🚦 Middleware is running before routes...");
  next();
});

// ✅ Ensure routes are loaded
console.log("✅ Loading evotlRoutes...");
app.use("/api/evtols",  evotlRouter);
console.log("✅ Loading authRoutes...");
app.use("/api/auth", authrouter);

// ✅ Debug: List all registered routes
console.log("✅ Registered Routes:");
app._router.stack.forEach((layer: any) => {
  if (layer.route) { // Ensure layer has a route
    const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase()).join(', ');
    console.log(`➡️ ${methods} ${layer.route.path}`);
  } else if (layer.name === "router") {
    layer.handle.stack.forEach((nestedLayer: any) => {
      if (nestedLayer.route) {
        const methods = Object.keys(nestedLayer.route.methods).map((m) => m.toUpperCase()).join(', ');
        console.log(`➡️ ${methods} ${nestedLayer.route.path}`);
      }
    });
  }
});




// ✅ Debug: Catch All Invalid Routes
app.use((req, res) => {
  console.error(`❌ Route Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});


