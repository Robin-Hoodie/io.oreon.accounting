import morgan from "morgan";
import { inDevelopment } from "./config";
import { filesUpload } from "./middleware/file-upload";
import { addErrorHandler } from "./middleware/add-error-handler";
import type { Router } from "express";


export const configureMiddleware = (router: Router): void => {
  // TODO: This doesn't seem to be working?
  router.use(morgan(inDevelopment() ? "dev" : "tiny"));
  router.use(filesUpload);
  router.use(addErrorHandler);
};
