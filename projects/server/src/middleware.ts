import { Express } from "express";
import morgan from "morgan";

export const configureMiddleware = (app: Express): void => {
// TODO: Let this depend on process.env.NODE_ENV
  app.use(morgan("dev"));
};

