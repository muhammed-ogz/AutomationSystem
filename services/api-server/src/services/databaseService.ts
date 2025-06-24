import { Connection, createConnection } from "mongoose";
import pino from "pino";

const logger = pino();

interface CompanyConnection {
  [companyId: string]: Connection;
}

// Şirket bağlantılarını saklamak için
const companyConnections: CompanyConnection = {};

export class DatabaseService {
  /**
   * Şirket için yeni veritabanı oluşturur ve temel koleksiyonları hazırlar
   */
  async createCompanyDatabase(
    databaseName: string,
    companyId: string
  ): Promise<boolean> {
    try {
      // MongoDB URI'sinden base URI'yi al
      const baseUri =
        process.env.MONGODB_URI?.split("/")[0] +
        "//" +
        process.env.MONGODB_URI?.split("/")[2];

      if (!baseUri) {
        throw new Error("MONGODB_URI bulunamadı");
      }

      // Şirket veritabanına bağlan (createConnection kullan, connect değil)
      const companyDbUri = `${baseUri}/${databaseName}`;
      const companyConnection = createConnection(companyDbUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });

      // Bağlantının açılmasını bekle
      await new Promise<void>((resolve, reject) => {
        companyConnection.once("open", () => {
          logger.info(`Şirket veritabanı bağlantısı açıldı: ${databaseName}`);
          resolve();
        });

        companyConnection.once("error", (error) => {
          logger.error(`Şirket veritabanı bağlantı hatası: ${error.message}`);
          reject(error);
        });
      });

      logger.info(`Şirket veritabanı oluşturuldu: ${databaseName}`);

      // Temel koleksiyonları oluştur
      await this.createBaseCollections(companyConnection, companyId);

      // Bağlantıyı sakla
      companyConnections[companyId] = companyConnection;

      return true;
    } catch (error: any) {
      logger.error(`Veritabanı oluşturma hatası: ${error.message}`);
      throw error;
    }
  }

  /**
   * Şirket veritabanında temel koleksiyonları oluşturur
   */
  private async createBaseCollections(
    connection: Connection,
    companyId: string
  ): Promise<void> {
    try {
      // Users koleksiyonu

      // Products koleksiyonu

      // Orders koleksiyonu

      // Customers koleksiyonu

      // Settings koleksiyonu

      // Koleksiyonları oluştur
      await connection.createCollection("users");
      await connection.createCollection("products");
      await connection.createCollection("orders");
      await connection.createCollection("customers");
      await connection.createCollection("settings");

      // İndeksleri oluştur
      await connection
        .collection("users")
        .createIndex({ email: 1 }, { unique: true });
      await connection.collection("users").createIndex({ companyId: 1 });

      await connection
        .collection("products")
        .createIndex({ sku: 1 }, { unique: true, sparse: true });
      await connection.collection("products").createIndex({ companyId: 1 });

      await connection
        .collection("orders")
        .createIndex({ orderNumber: 1 }, { unique: true });
      await connection.collection("orders").createIndex({ companyId: 1 });

      await connection
        .collection("customers")
        .createIndex({ email: 1, companyId: 1 }, { unique: true });

      await connection
        .collection("settings")
        .createIndex({ key: 1, companyId: 1 }, { unique: true });

      // Varsayılan ayarları ekle
      const defaultSettings = [
        {
          key: "company_currency",
          value: "TRY",
          description: "Şirket para birimi",
          companyId,
          createdAt: new Date(),
        },
        {
          key: "order_prefix",
          value: "ORD",
          description: "Sipariş numarası ön eki",
          companyId,
          createdAt: new Date(),
        },
        {
          key: "timezone",
          value: "Europe/Istanbul",
          description: "Şirket saat dilimi",
          companyId,
          createdAt: new Date(),
        },
      ];

      await connection.collection("settings").insertMany(defaultSettings);

      logger.info(`Temel koleksiyonlar oluşturuldu: ${companyId}`);
    } catch (error: any) {
      logger.error(`Koleksiyon oluşturma hatası: ${error.message}`);
      throw error;
    }
  }

  /**
   * Şirket veritabanına bağlantı alır
   */
  async getCompanyConnection(
    companyId: string,
    databaseName: string
  ): Promise<Connection> {
    try {
      // Mevcut bağlantı var mı kontrol et
      if (
        companyConnections[companyId] &&
        companyConnections[companyId].readyState === 1
      ) {
        return companyConnections[companyId];
      }

      // Yeni bağlantı oluştur
      const baseUri =
        process.env.MONGODB_URI?.split("/")[0] +
        "//" +
        process.env.MONGODB_URI?.split("/")[2];
      const companyDbUri = `${baseUri}/${databaseName}`;

      const companyConnection = createConnection(companyDbUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
      });

      // Bağlantının açılmasını bekle
      await new Promise<void>((resolve, reject) => {
        companyConnection.once("open", () => {
          resolve();
        });

        companyConnection.once("error", (error) => {
          reject(error);
        });
      });

      companyConnections[companyId] = companyConnection;

      return companyConnection;
    } catch (error: any) {
      logger.error(`Bağlantı alma hatası: ${error.message}`);
      throw error;
    }
  }

  /**
   * Şirket veritabanı bağlantısını kapat
   */
  async closeCompanyConnection(companyId: string): Promise<void> {
    try {
      if (companyConnections[companyId]) {
        await companyConnections[companyId].close();
        delete companyConnections[companyId];
        logger.info(`Şirket bağlantısı kapatıldı: ${companyId}`);
      }
    } catch (error: any) {
      logger.error(`Bağlantı kapatma hatası: ${error.message}`);
    }
  }

  /**
   * Tüm şirket bağlantılarını kapat
   */
  async closeAllConnections(): Promise<void> {
    try {
      const promises = Object.keys(companyConnections).map((companyId) =>
        this.closeCompanyConnection(companyId)
      );
      await Promise.all(promises);
      logger.info("Tüm şirket bağlantıları kapatıldı");
    } catch (error: any) {
      logger.error(`Tüm bağlantıları kapatma hatası: ${error.message}`);
    }
  }
}

// Singleton instance
const databaseService = new DatabaseService();

// Export functions
export const createCompanyDatabase = (
  databaseName: string,
  companyId: string
) => databaseService.createCompanyDatabase(databaseName, companyId);

export const getCompanyConnection = (companyId: string, databaseName: string) =>
  databaseService.getCompanyConnection(companyId, databaseName);

export const closeCompanyConnection = (companyId: string) =>
  databaseService.closeCompanyConnection(companyId);

export const closeAllConnections = () => databaseService.closeAllConnections();

export default databaseService;
