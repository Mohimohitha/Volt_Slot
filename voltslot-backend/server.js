import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import stationRoutes from "./routes/station.js";
import reservationRoutes from "./routes/reservation.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("VoltSlot Core Engine Running...");
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/voltslot";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`VoltSlot server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });