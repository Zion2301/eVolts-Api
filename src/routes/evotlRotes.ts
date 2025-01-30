import { Router } from "express";
import { registernweVOLT, getAlleVOLTS } from "../controllers/evoltController";


const evOLTrouter = Router()

evOLTrouter.post("/register", registernweVOLT);
evOLTrouter.get("/", getAlleVOLTS)

export default evOLTrouter