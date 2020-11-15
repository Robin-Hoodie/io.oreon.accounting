import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import { inDevelopment } from "../config";
import { addErrorHandler } from "./add-error-handler";
import type { Express } from "express";

const upload = multer();

export const configureMiddleware = (app: Express): void => {
  // TODO: This doesn't seem to be working?
  app.use(morgan(inDevelopment() ? "dev" : "tiny"));
  // TODO: Only allow CORS from certain origins, see https://expressjs.com/en/resources/middleware/cors.html
  app.use(cors());
  app.use(upload.array("invoices"));
  app.use(addErrorHandler);
};

