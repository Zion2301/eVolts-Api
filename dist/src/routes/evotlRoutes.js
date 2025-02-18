"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evoltController_1 = require("../controllers/evoltController");
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const authMiddleware_1 = require("../middleware/authMiddleware");
const evotlRouter = (0, express_1.Router)();
evotlRouter.post("/register", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, evoltController_1.registerEVOLT);
evotlRouter.get("/", evoltController_1.getAllEVOLTS);
evotlRouter.post("/upload-medication", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, cloudinaryConfig_1.uploadToCloudinaryMedicationImage);
evotlRouter.post("/load-medication/:serialNumber", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, evoltController_1.loadMedication);
evotlRouter.get("/battery-check/:serialNumber", authMiddleware_1.authenticate, evoltController_1.checkBatteryLevels);
evotlRouter.get("/medications/:serialNumber", authMiddleware_1.authenticate, evoltController_1.getMedicationsByEvoltSerial);
evotlRouter.get("/idle-evolts", authMiddleware_1.authenticate, evoltController_1.getIdleEVOLTs);
evotlRouter.get("/:serialNumber", authMiddleware_1.authenticate, evoltController_1.getEVOLTBySerial);
evotlRouter.get("/test", (req, res) => {
    res.status(200).json({ message: "Middleware is working!" });
});
exports.default = evotlRouter;
