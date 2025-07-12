import { Router } from "express";
import { Logger } from "pino";
import { CompanyProductController } from "src/controllers/ProductController";
import { companyAuthMiddleware } from "../middlewares/company";

export const createCompanyRoutes = (logger: Logger): Router => {
  const router = Router();
  const companyProductController = new CompanyProductController(logger);

  // Tüm company route'larına authentication middleware'i uygula
  router.use(companyAuthMiddleware);

  // Product routes
  companyProductController.registeredRoutes(router);

  return router;
};
