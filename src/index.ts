import express from "express"
import dotenv from "dotenv"
import evOLTrouter from "./routes/evotlRotes"

dotenv.config()
const app = express()

app.use(express.json())
app.use("/api/evolts", evOLTrouter)

const PORT = process.env.PORT;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})