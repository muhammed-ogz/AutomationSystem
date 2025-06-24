import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Hata formatlama fonksiyonu
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === "field" ? (error as any).path : "unknown",
      message: error.msg,
      value: error.type === "field" ? (error as any).value : undefined,
    }));

    return res.status(400).json({
      success: false,
      message: "Validasyon hatası",
      errors: formattedErrors,
    });
  }

  next();
};

// Şirket oluşturma validasyonu
export const validateCompany = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Şirket adı zorunludur")
    .isLength({ min: 2, max: 100 })
    .withMessage("Şirket adı 2-100 karakter arasında olmalıdır")
    .matches(/^[a-zA-ZğüşıöçĞÜŞIÖÇ0-9\s\-&.]+$/)
    .withMessage("Şirket adı geçersiz karakterler içeriyor"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email adresi zorunludur")
    .isEmail()
    .withMessage("Geçerli bir email adresi giriniz")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^(\+90|0)?[1-9]\d{9}$/)
    .withMessage("Geçerli bir telefon numarası giriniz (örn: 0599 999 99 99)"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Adres 500 karakterden fazla olamaz"),

  body("taxNumber")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Vergi numarası 10 haneli olmalıdır"),

  body("industry")
    .optional()
    .trim()
    .isIn([
      "Teknoloji",
      "Finans",
      "Sağlık",
      "Eğitim",
      "Perakende",
      "İmalat",
      "İnşaat",
      "Turizm",
      "Lojistik",
      "Enerji",
      "Tarım",
      "Medya",
      "Danışmanlık",
      "Diğer",
    ])
    .withMessage("Geçersiz sektör seçimi"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Açıklama 1000 karakterden fazla olamaz"),

  handleValidationErrors,
];

// Şirket güncelleme validasyonu
export const validateCompanyUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Şirket adı 2-100 karakter arasında olmalıdır")
    .matches(/^[a-zA-ZğüşıöçĞÜŞIÖÇ0-9\s\-&.]+$/)
    .withMessage("Şirket adı geçersiz karakterler içeriyor"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Geçerli bir email adresi giriniz")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^(\+90|0)?[1-9]\d{9}$/)
    .withMessage("Geçerli bir telefon numarası giriniz"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Adres 500 karakterden fazla olamaz"),

  body("taxNumber")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Vergi numarası 10 haneli olmalıdır"),

  body("industry")
    .optional()
    .trim()
    .isIn([
      "Teknoloji",
      "Finans",
      "Sağlık",
      "Eğitim",
      "Perakende",
      "İmalat",
      "İnşaat",
      "Turizm",
      "Lojistik",
      "Enerji",
      "Tarım",
      "Medya",
      "Danışmanlık",
      "Diğer",
    ])
    .withMessage("Geçersiz sektör seçimi"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Açıklama 1000 karakterden fazla olamaz"),
];
