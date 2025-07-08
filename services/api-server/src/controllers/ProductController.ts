import { Response, Router } from "express";
import { Logger } from "pino";
import { getCompanyInventoriesModel } from "../database/mongodb/models/CompanyInventories";
import {
  AuthenticatedRequest,
  companyAuthMiddleware,
} from "../middlewares/company";

export class CompanyProductController {
  public constructor(private readonly logger: Logger) {}

  public registeredRoutes(router: Router) {
    router
      .post("/add-product", companyAuthMiddleware, this.addProduct.bind(this))
      .get("/products", companyAuthMiddleware, this.getProducts.bind(this))
      .get(
        "/product/:id",
        companyAuthMiddleware,
        this.getProductById.bind(this)
      )
      .put("/product/:id", companyAuthMiddleware, this.updateProduct.bind(this))
      .delete(
        "/product/:id",
        companyAuthMiddleware,
        this.deleteProduct.bind(this)
      )
      .get(
        "/products/low-stock",
        companyAuthMiddleware,
        this.getLowStockProducts.bind(this)
      )
      .get(
        "/products/count",
        companyAuthMiddleware,
        this.getProductCount.bind(this)
      );
  }

  // Ürün ekleme
  public async addProduct(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      // Debug logları ekleyin
      console.log("=== ADD PRODUCT DEBUG ===");
      console.log("req.companyInfo:", req.companyInfo);
      console.log("req.companyConnection:", req.companyConnection);
      console.log("Connection readyState:", req.companyConnection?.readyState);
      console.log("========================");

      const { ProductName, ProductPrice, ProductQuantity, ProductImage } =
        req.body;
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;

      // Connection kontrolü ekleyin
      if (!connection) {
        res.status(500).json({
          success: false,
          message: "Database connection not found",
        });
        return;
      }

      if (!companyInfo) {
        res.status(401).json({
          success: false,
          message: "Company information not found",
        });
        return;
      }

      // Validation
      if (
        !ProductName ||
        ProductPrice === undefined ||
        ProductQuantity === undefined
      ) {
        res.status(400).json({
          success: false,
          message:
            "Gerekli alanlar eksik: ProductName, ProductPrice, ProductQuantity",
        });
        return;
      }

      // Fiyat ve miktar kontrolü
      if (ProductPrice < 0 || ProductQuantity < 0) {
        res.status(400).json({
          success: false,
          message: "Fiyat ve miktar negatif olamaz",
        });
        return;
      }

      // Company model'ini al
      const CompanyInventories = getCompanyInventoriesModel(connection);

      // Yeni ürün oluştur
      const newProduct = new CompanyInventories({
        CompanyId: companyInfo.companyId,
        ProductName: ProductName.trim(),
        ProductPrice: Number(ProductPrice),
        ProductQuantity: Number(ProductQuantity),
        ProductImage: ProductImage || "null",
      });

      // Veritabanına kaydet
      const savedProduct = await newProduct.save();

      this.logger.info(
        `Product added by company ${companyInfo.name}: ${ProductName}`
      );

      res.status(201).json({
        success: true,
        message: "Ürün başarıyla eklendi",
        data: savedProduct,
      });
    } catch (error: any) {
      this.logger.error(`Product add error: ${error.message}`);
      console.error("Full error:", error);

      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        res.status(400).json({
          success: false,
          message: "Validation hatası",
          errors: validationErrors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Ürünleri listeleme
  public async getProducts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;
      const { page = 1, limit = 10, search = "" } = req.query;

      const CompanyInventories = getCompanyInventoriesModel(connection);

      // Search query
      let query: any = { CompanyId: companyInfo.companyId };
      if (search) {
        query.ProductName = { $regex: search, $options: "i" };
      }

      // Pagination
      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);
      const skip = (pageNumber - 1) * limitNumber;

      const products = await CompanyInventories.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

      const totalProducts = await CompanyInventories.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limitNumber);

      res.status(200).json({
        success: true,
        message: "Ürünler başarıyla getirildi",
        data: products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
      });
    } catch (error: any) {
      this.logger.error(`Get products error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Belirli bir ürünü getirme
  public async getProductById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;

      const CompanyInventories = getCompanyInventoriesModel(connection);

      const product = await CompanyInventories.findOne({
        _id: id,
        CompanyId: companyInfo.companyId,
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Ürün bulunamadı",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Ürün başarıyla getirildi",
        data: product,
      });
    } catch (error: any) {
      this.logger.error(`Get product by ID error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Ürün güncelleme
  public async updateProduct(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { ProductName, ProductPrice, ProductQuantity, ProductImage } =
        req.body;
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;

      // Validation
      if (ProductPrice !== undefined && ProductPrice < 0) {
        res.status(400).json({
          success: false,
          message: "Fiyat negatif olamaz",
        });
        return;
      }

      if (ProductQuantity !== undefined && ProductQuantity < 0) {
        res.status(400).json({
          success: false,
          message: "Miktar negatif olamaz",
        });
        return;
      }

      const CompanyInventories = getCompanyInventoriesModel(connection);

      const updateData: any = {};
      if (ProductName) updateData.ProductName = ProductName.trim();
      if (ProductPrice !== undefined)
        updateData.ProductPrice = Number(ProductPrice);
      if (ProductQuantity !== undefined)
        updateData.ProductQuantity = Number(ProductQuantity);
      if (ProductImage) updateData.ProductImage = ProductImage;

      const updatedProduct = await CompanyInventories.findOneAndUpdate(
        { _id: id, CompanyId: companyInfo.companyId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          message: "Ürün bulunamadı",
        });
        return;
      }

      this.logger.info(`Product updated by company ${companyInfo.name}: ${id}`);

      res.status(200).json({
        success: true,
        message: "Ürün başarıyla güncellendi",
        data: updatedProduct,
      });
    } catch (error: any) {
      this.logger.error(`Update product error: ${error.message}`);

      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        res.status(400).json({
          success: false,
          message: "Validation hatası",
          errors: validationErrors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Ürün silme
  public async deleteProduct(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;

      const CompanyInventories = getCompanyInventoriesModel(connection);

      const deletedProduct = await CompanyInventories.findOneAndDelete({
        _id: id,
        CompanyId: companyInfo.companyId,
      });

      if (!deletedProduct) {
        res.status(404).json({
          success: false,
          message: "Ürün bulunamadı",
        });
        return;
      }

      this.logger.info(`Product deleted by company ${companyInfo.name}: ${id}`);

      res.status(200).json({
        success: true,
        message: "Ürün başarıyla silindi",
        data: deletedProduct,
      });
    } catch (error: any) {
      this.logger.error(`Delete product error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Düşük stoklu ürünler
  public async getLowStockProducts(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;
      const { threshold = 10 } = req.query;

      const CompanyInventories = getCompanyInventoriesModel(connection);

      const lowStockProducts = await CompanyInventories.find({
        CompanyId: companyInfo.companyId,
        ProductQuantity: { $lt: Number(threshold) },
      }).sort({ ProductQuantity: 1 });

      res.status(200).json({
        success: true,
        message: "Düşük stoklu ürünler başarıyla getirildi",
        data: lowStockProducts,
        count: lowStockProducts.length,
        threshold: Number(threshold),
      });
    } catch (error: any) {
      this.logger.error(`Get low stock products error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }

  // Toplam ürün sayısı
  public async getProductCount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const companyInfo = req.companyInfo!;
      const connection = req.companyConnection!;

      const CompanyInventories = getCompanyInventoriesModel(connection);

      const count = await CompanyInventories.countDocuments({
        CompanyId: companyInfo.companyId,
      });

      res.status(200).json({
        success: true,
        message: "Ürün sayısı başarıyla getirildi",
        data: {
          companyId: companyInfo.companyId,
          productCount: count,
        },
      });
    } catch (error: any) {
      this.logger.error(`Get product count error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        ...(process.env.NODE_ENV === "development" && {
          error: error.message,
        }),
      });
    }
  }
}
