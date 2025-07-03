import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { Logger } from "pino";
import { INTERNAL_SERVER_API_ERROR } from "../api";
import { getNotificationModel } from "../database/mongodb/models/Notification";

export class NotificationController {
  public constructor(private readonly logger: Logger) {}

  public registeredRoutes(router: Router) {
    // Firma id parametre olarak gelsin
    router.get(
      "/notifications/:companyId",
      this.getNotificationsByCompanyId.bind(this)
    );
  }

  async getNotificationsByCompanyId(req: Request, res: Response) {
    const { companyId } = req.params;

    try {
      // 1. Firma DB URI’sini oluştur (bunu sen ayarla, örnek verdim)
      const companyDbUri = `${process.env.MONGODB_COMP_DB}/${companyId}${process.env.MONGODB_OPTIONS}`;

      // 2. Firma DB bağlantısı aç
      const companyConnection = await mongoose.createConnection(
        companyDbUri,
        {}
      );

      // 3. Bağlantı üzerinden Notification modelini al
      const Notification = getNotificationModel(companyConnection);

      // 4. Bildirimleri çek (örnek: son 20, yeni → eski)
      const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      if (!notifications.length) {
        return res
          .status(404)
          .json({ message: "Bu şirkete ait bildirim bulunmamaktadır." });
      }

      res.status(200).json({
        success: true,
        message: "Bildirimler başarıyla alındı.",
        data: notifications,
      });

      // 5. Bağlantıyı kapatmayı unutma
      await companyConnection.close();
    } catch (error) {
      this.logger.error(
        `Error getting notifications for company ${companyId}: ${error}`
      );
      res.status(500).json({ message: INTERNAL_SERVER_API_ERROR });
    }
  }
}
