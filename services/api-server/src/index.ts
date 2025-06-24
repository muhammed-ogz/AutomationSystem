import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connect } from "mongoose";
import path from "path";
import pino from "pino";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
// controllers are connected here

import { UserController } from "./controllers/UserController";

//middlewares are connected here
const app = express();
const router = express.Router();
const logger = pino();
const PORT = 5000;

app.set("x-powered-by", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "../public")));

const userController = new UserController(logger);

userController.registerRoutes(router);
app.use(router);

(async function () {
  try {
    logger.info("Connecting to MongoDB...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    await connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB successfully");
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is running on http://0.0.0.0:${PORT}`);
    });
  } catch (err: any) {
    logger.error(
      `An error occurred during application startup : ${err.message || err}.`
    );
  }
})();
