import { Response, Router } from "express";
import { Logger } from "pino";
import {
  AuthenticatedRequest,
  companyAuthMiddleware,
} from "src/middlewares/company";
import { getStatisticsModel } from "../database/mongodb/models/Statistics";

export class StatisticsController {
  public constructor(private readonly logger: Logger) {}

  public registeredRoutes(router: Router) {
    router.get(
      "get-statistics",
      companyAuthMiddleware,
      this.getStatistics.bind(this)
    );
  }

  public async getStatistics(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    console.log("✅ getStatistics route hit");
    try {
      const companyInfo: any = req.companyInfo!;
      const connection = req.companyConnection!;
      const companyStatistics = getStatisticsModel(connection);

      // const totalProduct = await companyStatistics.getTotalProduct();
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
}
