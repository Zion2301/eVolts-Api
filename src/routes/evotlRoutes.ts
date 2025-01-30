import { Router } from "express";
import { registerEVOLT, getAllEVOLTS, loadMedication, checkBatteryLevels } from "../controllers/evoltController";

const evotlRouter = Router();

evotlRouter.post("/register", registerEVOLT);
evotlRouter.get("/", getAllEVOLTS);
evotlRouter.post("/load-medication/:serialNumber",  loadMedication)
evotlRouter.get("/battery-check/:serialNumber", checkBatteryLevels)

export default evotlRouter;
