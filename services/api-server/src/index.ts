import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose, { connect } from "mongoose";
import path from "path";
import pino from "pino";

// Services
import CompanyController from "./controllers/CompanyController";
import { closeAllConnections } from "./services/databaseService";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const logger = pino();
const PORT = 5000;
const router = express.Router();

// Express ayarları
app.set("x-powered-by", false);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS ayarları - React uygulamasının çalıştığı port'u da ekleyin
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000", // React development server
      "http://localhost:5173", // Vite development server
      "http://localhost:3001", // Alternatif React port
      "http://localhost:5000", // Mevcut backend port
      "http://127.0.0.1:3000", // IPv4 alternatifi
      "http://127.0.0.1:5173", // Vite IPv4 alternatifi
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Preflight istekleri için özel middleware
app.options("*", cors());

// Static files
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(router);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint bulunamadı",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response) => {
  logger.error(`Global error: ${err.message}`);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" ? "Bir hata oluştu" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const companyController = new CompanyController(logger);

companyController.registeredRoutes(router);
app.use(router);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    // Tüm şirket veritabanı bağlantılarını kapat
    await closeAllConnections();

    // Ana veritabanı bağlantısını kapat
    await mongoose.connection?.close();

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error: any) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
};

// Process event listeners
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Unhandled promise rejection
process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown("unhandledRejection");
});

// Uncaught exception
process.on("uncaughtException", (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  gracefulShutdown("uncaughtException");
});

// Ana uygulama başlatma fonksiyonu
(async function startApplication() {
  try {
    logger.info("Starting application...");

    // Environment variables kontrolü
    const requiredEnvVars = ["MONGODB_URI"];
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
      );
    }

    // MongoDB'ye bağlan
    logger.info("Connecting to MongoDB...");

    await connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    logger.info("Connected to MongoDB successfully");

    // Express sunucusunu başlat
    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is running on http://0.0.0.0:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`API Documentation: http://0.0.0.0:${PORT}/health`);
    });

    // Server timeout ayarları
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;
  } catch (err: any) {
    logger.error(`Application startup failed: ${err.message || err}`);
    process.exit(1);
  }
})();
