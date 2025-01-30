import { eVOLTS, WEIGHT } from "@prisma/client";
import { STATE } from "@prisma/client";

export interface eVOLTservice {
    registereVOLT(serialNumber: String, batteryLevel: Number, state: STATE, weight: WEIGHT): Promise<eVOLTS>
    getAllEVOLTS():Promise<eVOLTS[]>
    loadMedication(serialNumber: string, medications:any[]):Promise<string>
    checkBatterylevels(serialNumber: string): Promise<{ batteryLevel: number }>;
}