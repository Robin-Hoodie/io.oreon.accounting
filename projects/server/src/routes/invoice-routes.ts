import { RouteConfig, Quarter, SchemaFileWithDefaultFields } from "../types";
import { buildInvoiceRoute } from "../utils";
import { uploadInvoice } from "../drive/service/drive-service-create";
import { listPdfsInQuarterInYear } from "../drive/service/drive-service-list";
import type { Express } from "express";

export const configureInvoiceRoutes = (app: Express, { company, folderPrefix }: RouteConfig): void => {
  app.get(buildInvoiceRoute(company, folderPrefix), async (request, response, next) => {
    const { quarter, year } = request.params;
    try {
      response.json(await listPdfsInQuarterInYear(company, quarter as Quarter, year));
    } catch (error) {
      next(error);
    }
  });

  app.post(buildInvoiceRoute(company, folderPrefix), async (request, response, next) => {
    const { quarter, year } = request.params as { quarter: Quarter, year: string };
    const uploadedInvoices: SchemaFileWithDefaultFields[] = [];
    try {
      for (const file of request.files as Express.Multer.File[]) {
        uploadedInvoices.push(
          await uploadInvoice(company, year, quarter, file.buffer, file.originalname, file.mimetype)
        );
      }
      response.status(201).json(uploadedInvoices);
    } catch (error) {
      next(error);
    }
  });

};
