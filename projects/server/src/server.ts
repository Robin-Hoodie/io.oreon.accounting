import express  from "express";
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


export default getConfiguredRouterAndApp;
