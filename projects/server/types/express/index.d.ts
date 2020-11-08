import type { ServiceError } from "../../src/drive/service/service-error";

declare module "express-serve-static-core" {
  interface Response {
    handleError: (error: Error | ServiceError) => this;
  }
}
