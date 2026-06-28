import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

if (!process.env.OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY is missing. Analysis endpoints will fail.");
}

if (!process.env.FRONTEND_URL) {
  console.warn("Warning: FRONTEND_URL is not set. Falling back to http://localhost:5173");
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});
