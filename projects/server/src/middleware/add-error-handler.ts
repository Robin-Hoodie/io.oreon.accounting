import type { RequestHandler } from "express";
import { ServiceError } from "../drive/service/service-error";


// TODO: Handle errors from Drive API
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
