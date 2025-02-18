"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import CORS
const evotlRoutes_1 = __importDefault(require("./routes/evotlRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// import { authenticate } from "./middleware/authMiddleware";
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS Configuration
app.use((0, cors_1.default)({
    origin: '*', // Local frontend URL during development
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, auth tokens)
}));
app.use(express_1.default.json());
app.use("/api/evtols", evotlRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
