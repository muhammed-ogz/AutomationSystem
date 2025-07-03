import { Connection, Document, Model, Schema } from "mongoose";

export interface NotificationDocument extends Document {
  notificationId: string;
  companyId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const notificationSchema = new Schema<NotificationDocument>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, "Bildirim mesajı en fazla 500 karakter olabilir"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🚨 BURASI OLAYIN MERKEZİ: connection’a özel model döner
export function getNotificationModel(
  conn: Connection
): Model<NotificationDocument> {
  try {
    // Model zaten varsa tekrar tanımlama
    return conn.model<NotificationDocument>("Notification");
  } catch {
    // Yoksa yeni tanımla
    return conn.model<NotificationDocument>("Notification", notificationSchema);
  }
}
