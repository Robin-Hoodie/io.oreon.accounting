import type { RequestHandler } from "express";
import { ServiceError } from "../drive/service/service-error";

// TODO: Handle errors from Drive API
// TODO: Use error-handling middleware instead https://expressjs.com/en/guide/using-middleware.html#middleware.built-in
export const addErrorHandler: RequestHandler = (req, res, next) => {
  res.handleError = (error: Error | ServiceError) => {
    if (error instanceof ServiceError) {
      res.status(error.statusCode).json({
        message: error.message
      });
      next();
    } else {
      next();
    }
    return res;
  };
  next();
}
