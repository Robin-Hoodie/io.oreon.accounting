import express, { Express } from "express";
import { configureMiddleware } from "./middleware";

const getConfiguredRouterAndApp = (prefix: string): { app: express.Application, router: express.Router } => {
  const app = express();
  const router = express.Router();
  app.use(`/${prefix}`, router);
  configureMiddleware(router);
  return {
    router,
    app
  };
};

export const getConfiguredApp = (): Express => {
  const app = express();
  configureMiddleware(app);
  return app;
};

export default getConfiguredRouterAndApp;
