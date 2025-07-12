import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Connection } from "mongoose";

// Connection cache için tip tanımları
interface CompanyConnection {
  connection: Connection;
  lastUsed: Date;
}

// Connection cache
const connectionCache = new Map<string, CompanyConnection>();

// JWT payload interface
interface JWTPayload {
  email: string;
  name: string;
  companyId: string;
  dbName: string;
}

// Request interface'ini extend et
export interface AuthenticatedRequest extends Request {
  companyConnection?: Connection;
  companyInfo?: JWTPayload;
}

// Company Database Connection Manager
export class CompanyDatabaseManager {
  private static instance: CompanyDatabaseManager;
  private cleanupInterval: NodeJS.Timeout;

  private constructor() {
    // Her 30 dakikada bir kullanılmayan bağlantıları temizle
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupUnusedConnections();
      },
      30 * 60 * 1000
    );
  }

  public static getInstance(): CompanyDatabaseManager {
    if (!CompanyDatabaseManager.instance) {
      CompanyDatabaseManager.instance = new CompanyDatabaseManager();
    }
    return CompanyDatabaseManager.instance;
  }

  public async getCompanyConnection(dbName: string): Promise<Connection> {
    // Cache'den kontrol et
    if (connectionCache.has(dbName)) {
      const cachedConnection = connectionCache.get(dbName)!;
      cachedConnection.lastUsed = new Date();
      console.log(`Using cached connection for DB: ${dbName}`);
      return cachedConnection.connection;
    }

    // Yeni bağlantı oluştur
    const connection = await this.createConnection(dbName);
    connectionCache.set(dbName, {
      connection,
      lastUsed: new Date(),
    });

    return connection;
  }

  private async createConnection(dbName: string): Promise<Connection> {
    try {
      const connectionString = `${process.env.MONGODB_COMP_DB}/${dbName}${process.env.MONGODB_OPTIONS}`;
      console.log(`Creating new connection for: ${dbName}`);

      const connection = await mongoose.createConnection(connectionString, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      connection.on("connected", () => {
        console.log(`Successfully connected to company database: ${dbName}`);
      });

      connection.on("error", (error) => {
        console.error(`Database connection error for ${dbName}:`, error);
        connectionCache.delete(dbName);
      });

      connection.on("disconnected", () => {
        console.log(`Disconnected from company database: ${dbName}`);
        connectionCache.delete(dbName);
      });

      await new Promise<void>((resolve, reject) => {
        connection.once("connected", () => resolve());
        connection.once("error", (err) => reject(err));
      });

      return connection;
    } catch (error: any) {
      console.error(`Database connection failed for ${dbName}:`, error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  private cleanupUnusedConnections(): void {
    const now = new Date();
    const maxIdleTime = 60 * 60 * 1000; // 1 saat

    for (const [dbName, connectionInfo] of connectionCache.entries()) {
      const idleTime = now.getTime() - connectionInfo.lastUsed.getTime();

      if (idleTime > maxIdleTime) {
        console.log(`Closing idle connection for: ${dbName}`);
        connectionInfo.connection.close();
        connectionCache.delete(dbName);
      }
    }
  }

  public async closeAllConnections(): Promise<void> {
    for (const [, connectionInfo] of connectionCache.entries()) {
      await connectionInfo.connection.close();
    }
    connectionCache.clear();
    clearInterval(this.cleanupInterval);
  }
}

// Company Authentication & Database Connection Middleware
export const companyAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token bulunamadı. Lütfen giriş yapın.",
      });
      return;
    }

    // JWT token'ı doğrula
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JWTPayload;

    // Company bilgilerini request'e ekle
    req.companyInfo = decoded;

    // Company veritabanına bağlantı sağla
    const dbManager = CompanyDatabaseManager.getInstance();
    const companyConnection = await dbManager.getCompanyConnection(
      decoded.dbName
    );

    req.companyConnection = companyConnection;

    console.log(
      `Company authenticated: ${decoded.name} (${decoded.companyId})`
    );
    console.log(`Connected to database: ${decoded.dbName}`);

    next();
  } catch (error: any) {
    console.error("Company authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Geçersiz token. Lütfen tekrar giriş yapın.",
      });
      return;
    }

    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token süresi dolmuş. Lütfen tekrar giriş yapın.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Sunucu hatası. Lütfen tekrar deneyin.",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
