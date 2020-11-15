import express, { Express } from "express";
import { configureMiddleware } from "./middleware/middleware";

let app: Express;

export const getConfiguredApp = (): Express => {
  if (!app) {
    app = express();
    configureMiddleware(app);
  }
  return app;
};

