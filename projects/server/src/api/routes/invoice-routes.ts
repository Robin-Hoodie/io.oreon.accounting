import { RouteConfig, Quarter, SchemaFileWithDefaultFields } from "../../types";
import { buildInvoiceRoute } from "../../utils";
import { uploadInvoice } from "../../drive/service/drive-service-create";
import { listPdfsInQuarterInYear } from "../../drive/service/drive-service-list";
import type { UploadedFile } from "../../middleware/file-upload";
import type { Express } from "express";

export const configureInvoiceRoutes = (app: Express, { company, folderPrefix }: RouteConfig): void => {
  app.get(buildInvoiceRoute(company, folderPrefix), async (request, response) => {
    const { quarter, year } = request.params;
    try {
      response.json(await listPdfsInQuarterInYear(company, quarter as Quarter, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.post(buildInvoiceRoute(company, folderPrefix), async (request, response) => {
    const { quarter, year } = request.params as { quarter: Quarter, year: string };
    const uploadedInvoices: SchemaFileWithDefaultFields[] = [];
    try {
      // TODO: Is it necessary to cast to unknown first?
      for (const file of request.files as unknown as UploadedFile[]) {
        uploadedInvoices.push(await uploadInvoice(company, year, quarter, file.buffer, file.filename, file.mimetype));
      }
      response.status(201).json(uploadedInvoices);
    } catch (error) {
      response.handleError(error);
    }
  });

};
