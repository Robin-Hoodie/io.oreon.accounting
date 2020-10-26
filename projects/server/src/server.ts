import express from "express";
import { configureMiddleware } from "./middleware";

const getConfiguredExpressApp = (): express.Application => {
  const app = express();
  configureMiddleware(app);
  return app;
};

export default getConfiguredExpressApp;
