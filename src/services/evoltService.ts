import { eVOLTS } from "@prisma/client";
import { STATE } from "@prisma/client";

export interface eVOLTservice {
    registereVOLT(serialNumber: String, batteryLevel: Number, state: STATE): Promise<eVOLTS>
    getAlleVOLTS():Promise<eVOLTS[]>
}