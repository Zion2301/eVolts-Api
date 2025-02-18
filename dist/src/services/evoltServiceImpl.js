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
exports.eVOLTServiceImpl = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class eVOLTServiceImpl {
    getEVOLTBySerial(serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const evolt = yield prisma.eVOLTS.findUnique({ where: { serialNumber } });
                console.log(evolt);
                return evolt;
                // If not found, it will return null, no need to throw an error
            }
            catch (error) {
                console.error("Error fetching EVOLT by serial number:", error);
                throw new Error("Could not fetch EVOLT details.");
            }
        });
    }
    getidleEvolts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idleevolts = yield prisma.eVOLTS.findMany({ where: { state: "IDLE" } });
                return idleevolts;
            }
            catch (error) {
                console.error("Error fetching eVolts: ", error);
                throw new Error("Failed to retrive idle eVolts");
            }
        });
    }
    getMedicationsByEvoltSerial(serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const evolt = yield prisma.eVOLTS.findUnique({
                where: { serialNumber },
                include: { medications: true }, // Include related medications
            });
            if (!evolt) {
                throw new Error(`eVOLT with serial number ${serialNumber} not found`);
            }
            return evolt.medications;
        });
    }
    loadMedication(serialNumber, medications) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the eVTOL by serial number
            const evolt = yield prisma.eVOLTS.findUnique({
                where: { serialNumber },
                include: { medications: true }, // Include existing medications
            });
            if (!evolt) {
                throw new Error("eVOLT not found");
            }
            // Check battery level constraint
            if (evolt.batteryLevel < 25) {
                throw new Error(`Cannot load eVOLT ${serialNumber}, because battery is too low`);
            }
            // Calculate the current total weight of existing medications
            const currentWeight = evolt.medications.reduce((sum, med) => sum + med.weight, 0);
            // Calculate the total weight after adding the new medications
            const newMedicationsWeight = medications.reduce((sum, med) => sum + med.weight, 0);
            const totalWeight = currentWeight + newMedicationsWeight;
            // Check if the total weight exceeds the eVTOL's weight limit
            if (totalWeight > evolt.weightLimit) {
                throw new Error(`Cannot load medications: total weight exceeds eVTOL's weight limit of ${evolt.weightLimit} grams`);
            }
            // Add new medications to the database
            yield prisma.medication.createMany({
                data: medications.map((med) => ({
                    name: med.name,
                    weight: med.weight,
                    code: med.code,
                    image: med.image,
                    eVTOL_serialNumber: serialNumber,
                })),
            });
            // Update the eVTOL state to LOADING
            yield prisma.eVOLTS.update({
                where: { serialNumber },
                data: { state: 'LOADING' },
            });
            return `eVTOL ${serialNumber} successfully loaded with medications.`;
        });
    }
    checkBatterylevels(serialNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const evolt = yield prisma.eVOLTS.findUnique({
                where: { serialNumber }
            });
            if (!evolt) {
                throw new Error(`eVOLT with serial number ${serialNumber} was not found`);
            }
            // Log battery level in the database
            yield prisma.batteryLog.create({
                data: {
                    eVTOL_serialNumber: evolt.serialNumber,
                    batteryLevel: evolt.batteryLevel // Ensure this field exists in your model
                }
            });
            // Return the battery level
            return { batteryLevel: evolt.batteryLevel };
        });
    }
    registereVOLT(serialNumber, batteryLevel, state, weight) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingeVOLT = yield prisma.eVOLTS.findUnique({
                where: { serialNumber }
            });
            if (existingeVOLT) {
                throw new Error("eVOLT with this serial number already exists.");
            }
            return yield prisma.eVOLTS.create({
                data: {
                    serialNumber,
                    batteryLevel,
                    state,
                    weight
                }
            });
        });
    }
    getAllEVOLTS() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.eVOLTS.findMany();
        });
    }
}
exports.eVOLTServiceImpl = eVOLTServiceImpl;
