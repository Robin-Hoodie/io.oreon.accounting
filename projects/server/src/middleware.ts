import {  Router } from "express";
import morgan from "morgan";
import { inDevelopment } from "./config";

export const configureMiddleware = (router: Router): void => {
  // TODO: This doesn't seem to be working?
  router.use(morgan(inDevelopment() ? "dev" : "tiny"));
};

