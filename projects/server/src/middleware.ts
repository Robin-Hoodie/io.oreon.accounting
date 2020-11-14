import morgan from "morgan";
import cors from "cors";
import { inDevelopment } from "./config";
import { filesUpload } from "./middleware/file-upload";
import { addErrorHandler } from "./middleware/add-error-handler";
import type { Router } from "express";


export const configureMiddleware = (router: Router): void => {
  // TODO: This doesn't seem to be working?
  router.use(morgan(inDevelopment() ? "dev" : "tiny"));
  // TODO: Only allow CORS from certain origins, see https://expressjs.com/en/resources/middleware/cors.html
  router.use(cors())
  router.use(filesUpload);
  router.use(addErrorHandler);
};
