import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("MONGODB_URI is set:", !!process.env.MONGODB_URI);
console.log("MONGODB_URI begins:", String(process.env.MONGODB_URI || "").slice(0, 60));
console.log("MONGODB_URI ends:", String(process.env.MONGODB_URI || "").slice(-60));
console.log(
  "MONGODB_URI contains ssl=true:",
  String(process.env.MONGODB_URI || "").includes("ssl=true")
);
console.log(
  "MONGODB_URI contains replicaSet=",
  String(process.env.MONGODB_URI || "").includes("replicaSet=")
);
console.log(
  "MONGODB_URI contains authSource=",
  String(process.env.MONGODB_URI || "").includes("authSource=")
);
console.log(
  "MONGODB_URI contains appName=",
  String(process.env.MONGODB_URI || "").includes("appName=")
);
console.log(
  "MONGODB_URI contains /task_tracker:",
  String(process.env.MONGODB_URI || "").includes("/task_tracker")
);


if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, function () {
      console.log("Task Tracker running at http://localhost:" + PORT);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
