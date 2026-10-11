import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import Dairy from "./dairy.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/diary", async (req, res) => {
  res.json(await Dairy.find());
});

app.post("/diary", async (req, res) => {
  const { title, description } = req.body;
  const dairy = await Dairy.create({
    title: title,
    description: description,
  });

  res.status(201).json(dairy);
});

app.delete("/diary/:id", async (req, res) => {
  const deletedDiary = await Dairy.findByIdAndDelete(req.params.id);

  if (!deletedDiary) {
    res.status(404).json({
      message: "Diary Not Found",
    });
    return;
  }

  res.json(deletedDiary);
});
async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("mongo is missing");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(5000, () => {
      console.log("Server running on server 5000");
    });
  } catch (error) {
    console.error("Failed to start sevrer", error);
    process.exit(1);
  }
}

startServer();
