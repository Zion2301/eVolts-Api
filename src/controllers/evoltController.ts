import { Response, Request } from "express";
import { eVOLTServicImpl } from "../services/evoltServiceImpl";

const eVOLTService = new eVOLTServicImpl()
export const registernweVOLT = async (req:Request, res: Response) => {
    try {
        const {serialNumber, state, batteryLevel} = req.body
        if (!serialNumber || !state || batteryLevel == undefined || isNaN(batteryLevel)) {
            return res.status(400).json({error: "Missing fields are required"})
            
        }

        const evolt = await eVOLTService.registereVOLT(serialNumber, state, batteryLevel)
        return res.status(200).json({evolt})
    } catch (error) {
        return res.status(500).json({error})
    }
}
export const getAlleVOLTS = async (req:Request, res:Response) => {
    try {
        const evolts =  await eVOLTService.getAlleVOLTS()
        return res.status(200).json({evolts})
    } catch (error) {
        
    }
} 