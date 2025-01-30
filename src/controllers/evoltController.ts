import { Response, Request } from "express";
import { eVOLTServicImpl } from "../services/evoltServiceImpl";

const eVOLTService = new eVOLTServicImpl()
export const registernweVOLT = async (req:Request, res: Response): Promise<void> => {
    try {
        const {serialNumber, state, batteryLevel} = req.body
        if (!serialNumber || !state || batteryLevel == undefined || isNaN(batteryLevel)) {
         res.status(400).json({error: "Missing fields are required"})
         return
            
        }

        const evolt = await eVOLTService.registereVOLT(serialNumber, state, batteryLevel)
        res.status(200).json({evolt})
        return
    } catch (error) {
         res.status(500).json({error})
         return
    }
}
export const getAlleVOLTS = async (req:Request, res:Response): Promise<void> => {
    try {
        const evolts =  await eVOLTService.getAlleVOLTS()
         res.status(200).json({evolts})
         return
    } catch (error) {
       res.status(500).json({error})
       return 
    }
} 