import { Router } from "express";
import { registerEVOLT, getAllEVOLTS, loadMedication, checkBatteryLevels, getMedicationsByEvoltSerial } from "../controllers/evoltController";

const evotlRouter = Router();

evotlRouter.post("/register", registerEVOLT);
evotlRouter.get("/", getAllEVOLTS);
evotlRouter.post("/load-medication/:serialNumber",  loadMedication)
evotlRouter.get("/battery-check/:serialNumber", checkBatteryLevels)
evotlRouter.get("/medications/:serialNumber", getMedicationsByEvoltSerial)

export default evotlRouter;
