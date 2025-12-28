import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import educationalFactRoutes from "./routes/educationalFactRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Resto-AI backend is running");
});

// middleware
app.use("/api/facts", educationalFactRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));