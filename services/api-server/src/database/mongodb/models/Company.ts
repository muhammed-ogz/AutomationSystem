import { Document, Schema, model } from "mongoose";

interface Company extends Document {
  companyId: string;
  name: string;
  databaseName: string; //firma için kullanılacak veritabanı adı
  taxNumber: string;
  address: string;
  avatar: string; // Base64 veya URL formatında SVG
  password: string;
  smsNotification: boolean;
  emailNotification: boolean;
  email: string;
  phoneNumber: string;
  createdAt: Date;
}

const companySchema = new Schema<Company>(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: [2, "Şirket adı en az 2 karakter olmalıdır"],
      maxlength: [100, "Şirket adı en fazla 100 karakter olabilir"],
    },
    taxNumber: {
      type: String,
      required: [true, "Vergi numarası zorunludur"],
    },
    address: {
      country: {
        type: String,
        required: [true, "Ülke adı zorunludur"],
        maxlength: [50, "Ülke adı en fazla 50 karakter olabilir"],
      },
      city: {
        type: String,
        required: [true, "Şehir adı zorunludur"],
        minlength: [2, "Şehir adı en az 2 karakter olmalıdır"],
        maxlength: [50, "Şehir adı en fazla 50 karakter olabilir"],
      },
      district: {
        type: String,
        required: [true, "İlçe adı zorunludur"],
        minlength: [5, "İlçe adı en az 5 karakter olmalıdır"],
        maxlength: [100, "İlçe adı en fazla 50 karakter olabilir"],
      },
      postalCode: {
        type: String,
        required: [true, "Posta kodu zorunludur"],
        match: [/^\d{5}$/, "Posta kodu 5 basamaklı bir sayı olmalıdır"],
      },
      fullAddress: {
        type: String,
        required: [true, "Adres bilgisi zorunludur"],
        minlength: [30, "Adres en az 30 karakter olmalıdır"],
        maxlength: [300, "Adres en fazla 300 karakter olabilir"],
      },
    },
    avatar: {
      type: String,
      required: true,
    },
    databaseName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Geçersiz email formatı",
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      sparse: true,
      unique: true,
      validate: {
        validator: function (phone: string) {
          // Telefon numarası varsa format kontrolü yap
          if (!phone) return true;
          return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
        },
        message: "Geçersiz telefon numarası formatı",
      },
    },
    password: {
      required: true,
      type: String,
      minlength: [8, "Şifre en az 8 karakter olmalıdır"],
    },
    smsNotification: {
      type: Boolean,
      default: false,
    },
    emailNotification: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

companySchema.methods.toJSON = function () {
  const companyObj = this.toObject();
  delete companyObj.password; // Şifreyi JSON çıktısından kaldır
  return companyObj;
};

export default model<Company>("Company", companySchema);
