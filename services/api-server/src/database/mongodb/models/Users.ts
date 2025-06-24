import { Document, model, Schema } from "mongoose";

export interface Users extends Document {
  email: string;
  phoneNumber?: string;
  password: string;
  companyId: string;
  companyName: string;
  avatar: string;
  smsNotification: boolean;
  emailNotification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UsersSchema = new Schema<Users>(
  {
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
    companyId: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      // URL validasyonunu kaldırdık çünkü base64 SVG'ler de kabul ediyoruz
    },
    companyName: {
      required: true,
      type: String,
      trim: true,
      minlength: [2, "Şirket adı en az 2 karakter olmalıdır"],
      maxlength: [100, "Şirket adı en fazla 100 karakter olabilir"],
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
  },
  {
    timestamps: true,
    versionKey: false, // __v alanını kaldırır
  }
);

UsersSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const Users = model<Users>("Users", UsersSchema);
export default Users;
