import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import "express-async-errors";
import sponsorshipRouter from "./routes/sponsorship";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(bodyParser.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/sponsorship", sponsorshipRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

app.use(errorHandler);

export default app;
