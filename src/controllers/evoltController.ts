import { Request, Response } from "express";
import { eVOLTServiceImpl } from "../services/evoltServiceImpl";
import { eVOLTS, STATE, WEIGHT } from "@prisma/client";
import { uploadToCloudinaryMedicationImage } from "../config/cloudinaryConfig";
const eVOLTService = new eVOLTServiceImpl();

export const registerEVOLT = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serialNumber, state, batteryLevel, weight } = req.body;

        if (!serialNumber || !state || !weight || isNaN(Number(batteryLevel))) {
            res.status(400).json({ error: "Missing or invalid fields" });
            return;
        }

        // Assuming eVOLTService.registereVOLT is asynchronous and returns a result
        const batteryLevelInt = Number(batteryLevel);

        const evolt = await eVOLTService.registereVOLT(serialNumber, batteryLevelInt, state as STATE, weight as WEIGHT);
        res.status(201).json({ evolt });
        return
    } catch (error) {
        // Provide more informative error details
        console.error('Error in registerEVOLT:', error); // Logs the error on the server side
        res.status(500).json({ error: "Internal server error" });
        return
    }
};

export const getAllEVOLTS = async (req: Request, res: Response): Promise<void> => {
    try {
        const evolts = await eVOLTService.getAllEVOLTS();
        res.status(200).json({ evolts });
    } catch (error) {
        res.status(500).json({ error });
    }

    
};

export const loadMedication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serialNumber } = req.params;
        const { name, weight, code, image } = req.body; // Expecting image URL, not a file

        if (!name || !weight || !code || !image) {
            res.status(400).json({ error: "Missing required fields" });
            return 
        }

        // Send data to service layer
        const result = await eVOLTService.loadMedication(serialNumber, [
            { name, weight: Number(weight), code, image },
        ]);

        res.status(200).json({ message: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMedicationsByEvoltSerial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serialNumber } = req.params; // Get serial number from the request params
        const medications = await eVOLTService.getMedicationsByEvoltSerial(serialNumber);
        res.status(200).json({ medications });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
export const checkBatteryLevels = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serialNumber } = req.params; // Use params instead of body for better RESTful API
        const eVTOL = await eVOLTService.checkBatterylevels(serialNumber);

        if (!eVTOL) {
            res.status(404).json({ message: `eVTOL with serial number ${serialNumber} not found` });
            return;
        }

        res.status(200).json({ 
            message: `Battery level for eVTOL ${serialNumber}: ${eVTOL.batteryLevel}%`
            // batteryLevel: eVTOL.batteryLevel
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
};

export const getIdleEVOLTs = async (req: Request, res: Response): Promise<void> => {
    try {
        const idleEVOLTs = await eVOLTService.getidleEvolts();
        res.status(200).json({ success: true, data: idleEVOLTs });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEVOLTBySerial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serialNumber } = req.params;

        if (!serialNumber) {
            res.status(400).json({ error: "Serial number is required" });
            return;
        }

        const evolt = await eVOLTService.getEVOLTBySerial(serialNumber);

        if (!evolt) {
            res.status(404).json({ error: `EVOLT with serial number ${serialNumber} not found` });
            return;
        }

        res.status(200).json({ evolt });
    } catch (error: any) {
        console.error("Error fetching EVOLT details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



