import { Request, Response, Router } from "express";
import { Logger } from "pino";
import Inventories from "../database/mongodb/models/Inventories";

export class ProductController {
  public constructor(private readonly logger: Logger) {}
  public registeredRoutes(router: Router) {
    router
      .post("/add-product", ProductController.addProduct)
      .get("/products", ProductController.getProducts)
      .get("/product/:id", ProductController.getProductById)
      .put("/product/:id", ProductController.updateProduct)
      .delete("/product/:id", ProductController.deleteProduct)
      .get("/products/low-stock", ProductController.getLowStockProducts);
  }
  // Ürün ekleme
  public static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      const {
        CompanyId,
        ProductName,
        ProductPrice,
        ProductQuantity,
        ProductImage,
      } = req.body;

      // Validation
      if (
        !CompanyId ||
        !ProductName ||
        ProductPrice === undefined ||
        ProductQuantity === undefined
      ) {
        res.status(400).json({
          success: false,
          message:
            "Gerekli alanlar eksik: CompanyId, ProductName, ProductPrice, ProductQuantity",
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

      // Yeni ürün oluştur
      const newProduct = new Inventories({
        CompanyId,
        ProductName: ProductName.trim(),
        ProductPrice: Number(ProductPrice),
        ProductQuantity: Number(ProductQuantity),
        ProductImage: ProductImage || "null",
      });

      // Veritabanına kaydet
      const savedProduct = await newProduct.save();

      res.status(201).json({
        success: true,
        message: "Ürün başarıyla eklendi",
        data: savedProduct,
      });
    } catch (error: any) {
      console.error("Ürün ekleme hatası:", error);

      // Mongoose validation error
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
        error: error.message,
      });
    }
  }

  // Ürünleri listeleme
  public static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { CompanyId } = req.query;

      let query = {};
      if (CompanyId) {
        query = { CompanyId: CompanyId };
      }

      const products = await Inventories.find(query).sort({ _id: -1 }); // En yeni ürünler önce

      res.status(200).json({
        success: true,
        message: "Ürünler başarıyla getirildi",
        data: products,
        count: products.length,
      });
    } catch (error: any) {
      console.error("Ürünleri getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  }

  // Belirli bir ürünü getirme
  public static async getProductById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Inventories.findById(id);

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
      console.error("Ürün getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  }

  // Ürün güncelleme
  public static async updateProduct(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const {
        CompanyId,
        ProductName,
        ProductPrice,
        ProductQuantity,
        ProductImage,
      } = req.body;

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

      const updateData: any = {};
      if (CompanyId) updateData.CompanyId = CompanyId;
      if (ProductName) updateData.ProductName = ProductName.trim();
      if (ProductPrice !== undefined)
        updateData.ProductPrice = Number(ProductPrice);
      if (ProductQuantity !== undefined)
        updateData.ProductQuantity = Number(ProductQuantity);
      if (ProductImage) updateData.ProductImage = ProductImage;

      const updatedProduct = await Inventories.findByIdAndUpdate(
        id,
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

      res.status(200).json({
        success: true,
        message: "Ürün başarıyla güncellendi",
        data: updatedProduct,
      });
    } catch (error: any) {
      console.error("Ürün güncelleme hatası:", error);

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
        error: error.message,
      });
    }
  }

  // Ürün silme
  public static async deleteProduct(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const deletedProduct = await Inventories.findByIdAndDelete(id);

      if (!deletedProduct) {
        res.status(404).json({
          success: false,
          message: "Ürün bulunamadı",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Ürün başarıyla silindi",
        data: deletedProduct,
      });
    } catch (error: any) {
      console.error("Ürün silme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  }

  // Şirkete göre ürün sayısı
  public static async getProductCountByCompany(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { CompanyId } = req.params;

      const count = await Inventories.countDocuments({ CompanyId });

      res.status(200).json({
        success: true,
        message: "Ürün sayısı başarıyla getirildi",
        data: { CompanyId, productCount: count },
      });
    } catch (error: any) {
      console.error("Ürün sayısı getirme hatası:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  }

  // Stok durumu kontrolü
  public static async getLowStockProducts(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { CompanyId } = req.query;
      const { threshold = 10 } = req.query; // Default threshold 10

      let query: any = { ProductQuantity: { $lt: Number(threshold) } };
      if (CompanyId) {
        query.CompanyId = CompanyId;
      }

      const lowStockProducts = await Inventories.find(query).sort({
        ProductQuantity: 1,
      });

      res.status(200).json({
        success: true,
        message: "Düşük stoklu ürünler başarıyla getirildi",
        data: lowStockProducts,
        count: lowStockProducts.length,
        threshold: Number(threshold),
      });
    } catch (error: any) {
      console.error("Düşük stok kontrolü hatası:", error);
      res.status(500).json({
        success: false,
        message: "Sunucu hatası",
        error: error.message,
      });
    }
  }
}
