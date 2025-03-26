import { eVOLTS, WEIGHT, Order } from "@prisma/client";
import { STATE } from "@prisma/client";

export interface eVOLTservice {
    registereVOLT(serialNumber: String, batteryLevel: Number, state: STATE, weight: WEIGHT): Promise<eVOLTS>
    getAllEVOLTS():Promise<eVOLTS[]>
    loadMedication(serialNumber: string, medications:any[]):Promise<string>
    checkBatterylevels(serialNumber: string): Promise<{ batteryLevel: number }>;
    getMedicationsByEvoltSerial(serialNumber: string): Promise<any>
    getidleEvolts():Promise<any>
    getEVOLTBySerial(serialNumber: string): Promise<eVOLTS | null>;
    getOrdersByUser(userId: number): Promise<Order[]>;
    createOrder(userId: number, eVOLTSerial: string, medicationIds: number[]): Promise<Order>;
}