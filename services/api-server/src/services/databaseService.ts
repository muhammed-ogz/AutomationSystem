import { Connection, createConnection } from "mongoose";
import pino from "pino";
import { ColletionSchemas } from "../database/mongodb/schemas/ColletionSchemas";
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

      // Şirket veritabanına bağlan
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
      for (const [collectionName, fields] of Object.entries(ColletionSchemas)) {
        // Koleksiyonu oluştur
        await connection.createCollection(collectionName);

        // İndeksleri oluştur
        for (const field of fields as Array<any>) {
          if (field.unique) {
            const indexConfig: any = { [field.key]: 1 };
            await connection
              .collection(collectionName)
              .createIndex(indexConfig, {
                unique: true,
                sparse: field.sparse || false,
              });
          }
        }
      }

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
