import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import mongoose, { Connection } from "mongoose";
import { Logger } from "pino";
import { v4 as uuidv4 } from "uuid";
import Company from "../database/mongodb/models/Company";
import { createCompanyDatabase } from "../services/databaseService";

const connectionCache: Map<string, Connection> = new Map();
export class CompanyController {
  public constructor(private readonly logger: Logger) {}
  public registeredRoutes(router: Router) {
    router
      .get("/:id", this.getCompanyById.bind(this))
      .put("/:id", this.updateCompany.bind(this))
      .delete("/:id", this.deactivateCompany.bind(this))
      .get("/:id/database", this.getCompanyDatabaseInfo.bind(this))
      .post("/register", this.createCompany.bind(this))
      .post("/login", this.companyLogin.bind(this));
  }
  // Yeni şirket oluştur
  async createCompany(req: Request, res: Response) {
    try {
      const { name, email, password, phone, address, taxNumber } = req.body;
      // Validasyon
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Company name and email required",
        });
      }
      if (!taxNumber) {
        return res.status(400).json({
          success: false,
          message: "Tax number is required",
        });
      }

      const existingCompany = await Company.findOne({
        $or: [{ name }, { email }],
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: "This company name or email address is being used",
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password is required and must be at least 6 characters",
        });
      }
      if (
        !password.match(
          /^(?=.*[a-zıöüşçğ])(?=.*[A-ZİÖÜŞÇĞ])(?=.*\d)(?=.*[!@#$%^&*\(\)\-_\+=\[\]{};:'",.<>?/])[a-zA-ZıİöÖüÜşŞçÇğĞ\d!@#$%^&*\(\)\-_\+=\[\]{};:'",.<>?/]{6,}$/
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const uuid = uuidv4();
      const companyId = uuid.replace(/-/g, "").slice(0, 16);
      const dbName = `company_${companyId}`;

      // Şirket adından avatar oluştur (baş harfler)
      const generateAvatar = (companyName: string): string => {
        const words = companyName.trim().split(/\s+/);
        let initials = "";

        if (words.length === 1) {
          // Tek kelimeyse ilk 2 harfi al
          initials = words[0].substring(0, 2).toUpperCase();
        } else {
          // Birden fazla kelimeyse her kelimenin ilk harfini al (max 3)
          initials = words
            .slice(0, 3)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        }

        // SVG avatar oluştur
        const colors = [
          "#3B82F6",
          "#EF4444",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
          "#06B6D4",
          "#84CC16",
          "#F97316",
        ];
        const bgColor = colors[Math.floor(Math.random() * colors.length)];

        return `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" fill="${bgColor}" rx="12"/>
          <text x="50" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
                fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
        </svg>`;
      };

      const avatar = generateAvatar(name);

      // Yeni şirket oluştur
      const company = new Company({
        companyId: companyId,
        name,
        email,
        phoneNumber: phone,
        address,
        taxNumber,
        databaseName: dbName,
        avatar,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await company.save();

      await createCompanyDatabase(dbName, company._id.toString());

      this.logger.info(`New company created: ${name} (DB: ${dbName})`);

      res.status(201).json({
        success: true,
        message: "Company create process is succesfully",
        data: {
          id: company._id,
          name: company.name,
          email: company.email,
          phoneNumber: company.phoneNumber,
          address: company.address,
          taxNumber: company.taxNumber,
          avatar: company.avatar,
          databaseName: company.databaseName,
          createdAt: company.createdAt,
        },
      });
    } catch (error: any) {
      this.logger.error(`Company creating error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Company creating error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Tüm şirketleri listele
  async getAllCompanies(res: Response) {
    try {
      const companies = await Company.find({ isActive: true })
        .select("-__v")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        message: "Companies successfully listed",
        data: companies,
        count: companies.length,
      });
    } catch (error: any) {
      this.logger.error(`Error listing companies: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "An error occurred while listing companies",
      });
    }
  }

  // Şirket ID'sine göre getir
  async getCompanyById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await Company.findById(id).select("-__v");

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "The company was successfully found.",
        data: company,
      });
    } catch (error: any) {
      this.logger.error(`Failure to bring company: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving company information",
      });
    }
  }

  // Şirket güncelle
  async updateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Hassas alanları güncellemeyi engelle
      delete updateData.databaseName;
      delete updateData.createdAt;

      const company = await Company.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      this.logger.info(`Company updated: ${company.name}`);

      res.status(200).json({
        success: true,
        message: "Company create process is successfully",
        data: company,
      });
    } catch (error: any) {
      this.logger.error(`Company update error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the company",
      });
    }
  }

  // Şirketi pasife al (soft delete)
  async deactivateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await Company.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      this.logger.info(`Company deactivated: ${company.name}`);

      res.status(200).json({
        success: true,
        message: "Company deactivate process is succesfully",
      });
    } catch (error: any) {
      this.logger.error(`Company deactivate process error:  ${error.message}`);
      res.status(500).json({
        success: false,
        message: "An error occurred while inactivating the company",
      });
    }
  }

  // Şirket veritabanı bağlantı bilgilerini getir
  async getCompanyDatabaseInfo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const company = await Company.findById(id).select(
        "name databaseName isActive"
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      if (!(company as any).isActive) {
        return res.status(403).json({
          success: false,
          message: "Company is don't activate",
        });
      }

      res.status(200).json({
        success: true,
        message: "Database information received",
        data: {
          companyName: company.name,
          databaseName: company.databaseName,
        },
      });
    } catch (error: any) {
      this.logger.error(
        `Database information retrieval error: ${error.message}`
      );
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving database information",
      });
    }
  }
  async companyLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email ve şifre gereklidir",
        });
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz email formatı",
        });
      }

      // Şirketi ana veritabanında bul
      const company = await Company.findOne({ email });
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Şirket bulunamadı. Email adresinizi kontrol edin.",
        });
      }

      // Şifre doğrulama
      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Geçersiz şifre. Lütfen tekrar deneyin.",
        });
      }

      // Company database name'i doğru şekilde oluştur
      const companyDbName =
        company.databaseName || `company_${company.companyId}`;
      console.log(
        `Attempting login for company: ${company.name}, DB: ${companyDbName}`
      );

      // Veritabanı bağlantısını aç ve cache'le
      try {
        await this.connectToCompanyDatabase(companyDbName);
        this.logger.info(
          `Successfully connected to company database: ${companyDbName}`
        );
      } catch (dbError: any) {
        this.logger.error(
          `Failed to connect to company database ${companyDbName}: ${dbError.message}`
        );

        const errorMessage =
          process.env.NODE_ENV === "development"
            ? `Veritabanı bağlantı hatası: ${dbError.message}`
            : "Şirket veritabanına bağlanırken hata oluştu.";

        return res.status(500).json({
          success: false,
          message: errorMessage,
        });
      }

      // JWT token oluştur
      const tokenPayload = {
        email: company.email,
        name: company.name,
        companyId: company.companyId,
        dbName: companyDbName,
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Giriş başarılı",
        data: {
          token,
          companyId: company.companyId,
          name: company.name,
          email: company.email,
          avatar: company.avatar,
          dbName: companyDbName,
          redirectTo: `/dashboard`,
        },
      });

      this.logger.info(
        `Successful login for company: ${company.name} (${company.email})`
      );
    } catch (error: any) {
      this.logger.error(`Company login error: ${error.message}`);

      const errorResponse = {
        success: false,
        message: "Sunucu hatası. Lütfen tekrar deneyin.",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
          stack: error.stack,
        }),
      };

      res.status(500).json(errorResponse);
    }
  }

  // Cache destekli bağlantı açma fonksiyonu
  private async connectToCompanyDatabase(dbName: string): Promise<Connection> {
    if (connectionCache.has(dbName)) {
      console.log(`Using cached connection for DB: ${dbName}`);
      return connectionCache.get(dbName)!;
    }

    try {
      const connectionString = `${process.env.MONGODB_COMP_DB}/${dbName}${process.env.MONGODB_OPTIONS}`;
      console.log(`Attempting to connect to: ${connectionString}`);

      const companyConnection = await mongoose.createConnection(
        connectionString,
        {}
      );

      // Event dinleyicileri (opsiyonel)
      companyConnection.on("connected", () => {
        console.log(`Successfully connected to company database: ${dbName}`);
      });

      companyConnection.on("error", (error) => {
        console.error(`Database connection error: ${error}`);
      });

      companyConnection.on("disconnected", () => {
        console.log(`Disconnected from company database: ${dbName}`);
      });

      // Bağlantı açılmasını bekle (mongoose.createConnection artık Promise dönüyor)
      await new Promise<void>((resolve, reject) => {
        companyConnection.once("connected", () => resolve());
        companyConnection.once("error", (err) => reject(err));
      });

      connectionCache.set(dbName, companyConnection);

      console.log(`Database connection successfully validated for: ${dbName}`);

      return companyConnection;
    } catch (error: any) {
      console.error(`Database connection failed for ${dbName}:`, error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }
}

export default CompanyController;
