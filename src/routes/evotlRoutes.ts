import { NextFunction, Request, Router } from "express";
import { registerEVOLT, getAllEVOLTS, loadMedication, checkBatteryLevels, getMedicationsByEvoltSerial, getIdleEVOLTs, getEVOLTBySerial } from "../controllers/evoltController";
import { uploadToCloudinaryMedicationImage } from "../config/cloudinaryConfig";
interface CustomRequest extends Request {
    uploadedImageUrl?: string; // Extend Request with uploadedImageUrl
}

const evotlRouter = Router();

evotlRouter.post("/register", registerEVOLT);
evotlRouter.get("/", getAllEVOLTS);
evotlRouter.post("/upload-medication", uploadToCloudinaryMedicationImage)
evotlRouter.post("/load-medication/:serialNumber", loadMedication)
evotlRouter.get("/battery-check/:serialNumber", checkBatteryLevels)
evotlRouter.get("/medications/:serialNumber", getMedicationsByEvoltSerial)
evotlRouter.get("/idle-evolts", getIdleEVOLTs);
evotlRouter.get("/:serialNumber", getEVOLTBySerial);

export default evotlRouter;
