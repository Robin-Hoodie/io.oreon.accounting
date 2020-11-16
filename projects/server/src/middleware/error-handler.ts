import type { ErrorRequestHandler } from "express";
import { ServiceError } from "../drive/service/service-error";

// TODO: Handle errors from Drive API
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof ServiceError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }
  return next(err);
};
