import { Document, Schema, model } from "mongoose";

interface Company extends Document {
  name: string;
  databaseName: string; //firma için kullanılacak veritabanı adı
  createdAt: Date;
  avatar: string; // Base64 veya URL formatında SVG
  password: string;
  smsNotification: boolean;
  emailNotification: boolean;
  email: string;
  phoneNumber: string;
}

const companySchema = new Schema<Company>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: [2, "Şirket adı en az 2 karakter olmalıdır"],
      maxlength: [100, "Şirket adı en fazla 100 karakter olabilir"],
    },
    avatar: {
      type: String,
      required: true,
      // URL validasyonunu kaldırdık çünkü base64 SVG'ler de kabul ediyoruz
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
      trim: true,
      sparse: true, // Boş değerler için unique kontrolü yapmaz
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
    versionKey: false, // __v alanını kaldırır
  }
);

companySchema.methods.toJSON = function () {
  const companyObj = this.toObject();
  delete companyObj.password; // Şifreyi JSON çıktısından kaldır
  return companyObj;
};

export default model<Company>("Company", companySchema);
