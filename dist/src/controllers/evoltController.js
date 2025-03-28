"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.getUserOrders = exports.getEVOLTBySerial = exports.getIdleEVOLTs = exports.checkBatteryLevels = exports.getMedicationsByEvoltSerial = exports.loadMedication = exports.getAllEVOLTS = exports.registerEVOLT = void 0;
const evoltServiceImpl_1 = require("../services/evoltServiceImpl");
const eVOLTService = new evoltServiceImpl_1.eVOLTServiceImpl();
const registerEVOLT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber, state, batteryLevel, weight } = req.body;
        if (!serialNumber || !state || !weight || isNaN(Number(batteryLevel))) {
            res.status(400).json({ error: "Missing or invalid fields" });
            return;
        }
        // Assuming eVOLTService.registereVOLT is asynchronous and returns a result
        const batteryLevelInt = Number(batteryLevel);
        const evolt = yield eVOLTService.registereVOLT(serialNumber, batteryLevelInt, state, weight);
        res.status(201).json({ evolt });
        return;
    }
    catch (error) {
        // Provide more informative error details
        console.error('Error in registerEVOLT:', error); // Logs the error on the server side
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
exports.registerEVOLT = registerEVOLT;
const getAllEVOLTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evolts = yield eVOLTService.getAllEVOLTS();
        res.status(200).json({ evolts });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.getAllEVOLTS = getAllEVOLTS;
const loadMedication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        const { name, weight, code } = req.body; // Expecting image URL, not a file
        if (!name || !weight || !code) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        // Send data to service layer
        const result = yield eVOLTService.loadMedication(serialNumber, [
            {
                name, weight: Number(weight), code,
                image: ""
            },
        ]);
        res.status(200).json({ message: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.loadMedication = loadMedication;
const getMedicationsByEvoltSerial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params; // Get serial number from the request params
        const medications = yield eVOLTService.getMedicationsByEvoltSerial(serialNumber);
        res.status(200).json({ medications });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getMedicationsByEvoltSerial = getMedicationsByEvoltSerial;
const checkBatteryLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params; // Use params instead of body for better RESTful API
        const eVTOL = yield eVOLTService.checkBatterylevels(serialNumber);
        if (!eVTOL) {
            res.status(404).json({ message: `eVTOL with serial number ${serialNumber} not found` });
            return;
        }
        res.status(200).json({
            message: `Battery level for eVTOL ${serialNumber}: ${eVTOL.batteryLevel}%`
            // batteryLevel: eVTOL.batteryLevel
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.checkBatteryLevels = checkBatteryLevels;
const getIdleEVOLTs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idleEVOLTs = yield eVOLTService.getidleEvolts();
        res.status(200).json({ success: true, data: idleEVOLTs });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getIdleEVOLTs = getIdleEVOLTs;
const getEVOLTBySerial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serialNumber } = req.params;
        if (!serialNumber) {
            res.status(400).json({ error: "Serial number is required" });
            return;
        }
        const evolt = yield eVOLTService.getEVOLTBySerial(serialNumber);
        if (!evolt) {
            res.status(404).json({ error: `EVOLT with serial number ${serialNumber} not found` });
            return;
        }
        res.status(200).json({ evolt });
    }
    catch (error) {
        console.error("Error fetching EVOLT details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getEVOLTBySerial = getEVOLTBySerial;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming user ID is stored in `req.user`
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const orders = yield eVOLTService.getOrdersByUser(userId);
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserOrders = getUserOrders;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // Assuming user ID is stored in `req.user`
        const { eVOLTSerial, medicationIds } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!eVOLTSerial || !Array.isArray(medicationIds) || medicationIds.length === 0) {
            res.status(400).json({ error: "Missing or invalid order details" });
            return;
        }
        const order = yield eVOLTService.createOrder(userId, eVOLTSerial, medicationIds);
        res.status(201).json({ success: true, order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});
exports.createOrder = createOrder;
