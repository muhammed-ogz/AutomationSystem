import { Request, Response, Router } from "express";
import pino, { Logger } from "pino";
import Company from "../database/mongodb/models/Company";
import { createCompanyDatabase } from "../services/databaseService";

const logger = pino();

export class CompanyController {
  public constructor(private readonly logger: Logger) {}
  public registeredRoutes(router: Router) {
    router
      .get("/:id", this.getCompanyById.bind(this))
      .put("/:id", this.updateCompany.bind(this))
      .delete("/:id", this.deactivateCompany.bind(this))
      .get("/:id/database", this.getCompanyDatabaseInfo.bind(this))
      .post("/register", this.createCompany.bind(this));
  }
  // Yeni şirket oluştur
  async createCompany(req: Request, res: Response) {
    try {
      const { name, email, phone, address, taxNumber, industry, description } =
        req.body;

      // Validasyon
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Company name and email required",
        });
      }

      // Aynı isimde şirket var mı kontrol et
      const existingCompany = await Company.findOne({
        $or: [{ name }, { email }],
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: "This company name or email address is being used",
        });
      }

      // Şirket için benzersiz veritabanı adı oluştur
      const dbName = `company_${name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")}_${Date.now()}`;

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
        name,
        email,
        phoneNumber: phone || undefined, // Model'de phoneNumber olarak tanımlı
        address,
        taxNumber,
        industry,
        description,
        databaseName: dbName,
        avatar,
        password: "defaultPassword123", // Bu kısmı gerçek projede hash'lemelisin
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

      logger.info(`Company updated: ${company.name}`);

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

      logger.info(`Company deactivated: ${company.name}`);

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
}

export default CompanyController;
