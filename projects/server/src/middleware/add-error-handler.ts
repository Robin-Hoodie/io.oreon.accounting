import type { RequestHandler } from "express";
import { ServiceError } from "../drive/service/service-error";

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
