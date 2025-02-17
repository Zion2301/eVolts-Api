import { NextFunction, Request, Router } from "express";
import { registerEVOLT, getAllEVOLTS, loadMedication, checkBatteryLevels, getMedicationsByEvoltSerial, getIdleEVOLTs, getEVOLTBySerial } from "../controllers/evoltController";
import { uploadToCloudinaryMedicationImage } from "../config/cloudinaryConfig";
import { authenticate, isAdmin } from "../middleware/authMiddleware";
interface CustomRequest extends Request {
    uploadedImageUrl?: string; // Extend Request with uploadedImageUrl
}

const evotlRouter = Router();

evotlRouter.post("/register", authenticate, isAdmin, registerEVOLT);
evotlRouter.get("/", authenticate, getAllEVOLTS);
evotlRouter.post("/upload-medication",authenticate, isAdmin, uploadToCloudinaryMedicationImage)
evotlRouter.post("/load-medication/:serialNumber",authenticate, isAdmin, loadMedication)
evotlRouter.get("/battery-check/:serialNumber", authenticate, checkBatteryLevels)
evotlRouter.get("/medications/:serialNumber",authenticate, getMedicationsByEvoltSerial)
evotlRouter.get("/idle-evolts", authenticate, getIdleEVOLTs);
evotlRouter.get("/:serialNumber", authenticate, getEVOLTBySerial);

export default evotlRouter;
