import express from "express";
import dotenv from "dotenv";
import evotlRouter from "./routes/evotlRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/evtols", evotlRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
