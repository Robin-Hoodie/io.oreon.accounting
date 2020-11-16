import express, { Express } from "express";
import { configureMiddleware } from "./middleware";

export const serverWithMiddleware = (): Express => {
  const app = express();
  configureMiddleware(app);
  return app;
};

