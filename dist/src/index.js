"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const evotlRoutes_1 = __importDefault(require("./routes/evotlRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ CORS before routes
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
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
app.use("/api/evtols", authMiddleware_1.authenticate, evotlRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
