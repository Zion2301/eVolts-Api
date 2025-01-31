import { PrismaClient, STATE, WEIGHT, eVOLTS } from "@prisma/client";
import { eVOLTservice } from "./evoltService";


const prisma = new PrismaClient();
export class eVOLTServiceImpl implements eVOLTservice{
   async getidleEvolts(): Promise<any> {
        try {
            const idleevolts = await prisma.eVOLTS.findMany({where: {state: "IDLE"}})
            return idleevolts
        } catch (error) {
            console.error("Error fetching eVolts: ", error)
            throw new Error("Failed to retrive idle eVolts");
        }
    }
   async getMedicationsByEvoltSerial(serialNumber: string): Promise<any> {
    const evolt = await prisma.eVOLTS.findUnique({
        where: { serialNumber },
        include: { medications: true }, // Include related medications
    });

    if (!evolt) {
        throw new Error(`eVOLT with serial number ${serialNumber} not found`);
    }

    return evolt.medications;
    }
    async loadMedication(serialNumber: string, medications: { name: string; weight: number; code: string; image: string }[]): Promise<string> {
        // Fetch the eVTOL by serial number
        const evolt = await prisma.eVOLTS.findUnique({
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
        await prisma.medication.createMany({
            data: medications.map((med) => ({
                name: med.name,
                weight: med.weight,
                code: med.code,
                image: med.image,
                eVTOL_serialNumber: serialNumber,
            })),
        });
    
        // Update the eVTOL state to LOADING
        await prisma.eVOLTS.update({
            where: { serialNumber },
            data: { state: 'LOADING' },
        });
    
        return `eVTOL ${serialNumber} successfully loaded with medications.`;
    }
    
    async checkBatterylevels(serialNumber: string): Promise<{ batteryLevel: number }> {
        const evolt = await prisma.eVOLTS.findUnique({
            where: { serialNumber }
        });
    
        if (!evolt) {
            throw new Error(`eVOLT with serial number ${serialNumber} was not found`);
        }
    
        // Log battery level in the database
        await prisma.batteryLog.create({
            data: {
                eVTOL_serialNumber: evolt.serialNumber,
                batteryLevel: evolt.batteryLevel // Ensure this field exists in your model
            }
        });
    
        // Return the battery level
        return { batteryLevel: evolt.batteryLevel };
    }
    
   async registereVOLT(serialNumber: string, batteryLevel: number, state: STATE, weight: WEIGHT): Promise<eVOLTS> {
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
            state,
             weight
        }
       })

    }
    async getAllEVOLTS(): Promise<eVOLTS[]> {
        return await prisma.eVOLTS.findMany();
    }
    

}


