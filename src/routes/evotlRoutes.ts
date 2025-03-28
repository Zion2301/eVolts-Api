import { Router } from "express";
import { 
  registerEVOLT, getAllEVOLTS, loadMedication, checkBatteryLevels, 
  getMedicationsByEvoltSerial, getIdleEVOLTs, getEVOLTBySerial, 
  createOrder,
  getUserOrders
} from "../controllers/evoltController";
import { uploadToCloudinaryMedicationImage } from "../config/cloudinaryConfig";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const evotlRouter = Router();

// Log middleware to check if it's being executed
evotlRouter.use((req, res, next) => {
  console.log(`🚀 Inside evotlRouter. Request: ${req.method} ${req.path}`);
  next();
});

// ✅ Only Protected Routes Require Authentication
evotlRouter.post("/register", authenticate, isAdmin, registerEVOLT);
evotlRouter.get("/", getAllEVOLTS);  // Public route, no authentication needed
evotlRouter.post("/upload-medication", authenticate, isAdmin, uploadToCloudinaryMedicationImage);
evotlRouter.get("/orders", authenticate, (req, res) => {
  console.log("🔥 Orders route is being hit!");
  res.status(200).json({ message: "Orders fetched successfully!" });
});
  // ✅ Place this first
evotlRouter.post("/neworder", authenticate, createOrder);
evotlRouter.post("/load-medication/:serialNumber", authenticate, isAdmin, loadMedication);
evotlRouter.get("/battery-check/:serialNumber", authenticate, checkBatteryLevels);
evotlRouter.get("/medications/:serialNumber", authenticate, getMedicationsByEvoltSerial);
evotlRouter.get("/idle-evolts", authenticate, getIdleEVOLTs);

evotlRouter.get("/:serialNumber", authenticate, getEVOLTBySerial);

// ✅ This route should always require authentication
evotlRouter.get("/test", authenticate, (req, res) => {
  console.log("✅ Test route hit!");
  res.status(200).json({ message: "Middleware is working!" });
});

export default evotlRouter;
