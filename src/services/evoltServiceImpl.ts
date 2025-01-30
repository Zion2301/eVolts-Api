import { PrismaClient, STATE, eVOLTS } from "@prisma/client";
import { eVOLTservice } from "./evoltService";


const prisma = new PrismaClient();
export class eVOLTServicImpl implements eVOLTservice{
   async registereVOLT(serialNumber: string, batteryLevel: number, state: STATE): Promise<eVOLTS> {
       const existingeVOLT = await prisma.eVOLTS.findUnique({
        where: {serialNumber}
       })

       if (existingeVOLT) {
           throw new Error("eVOLT with this serial number already exists.");
           
       }

      return await prisma.eVOLTS.create({
        data: {
            serialNumber,
            batteryLevel,
            state
        }
       })
    }
    async getAlleVOLTS(): Promise<eVOLTS[]> {
        return await prisma.eVOLTS.findMany();
    }
    
}