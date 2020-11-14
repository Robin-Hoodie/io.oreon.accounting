import { Company, FolderPrefix, Quarter, SchemaFileWithDefaultFields } from "../../types";
import { Express } from "express";
import { getConfiguredApp } from "../../../server";
import { buildInvoiceRoute } from "../../utils";
import { uploadInvoice } from "../../service/drive-service-create";
import { listPdfsInQuarterInYear } from "../../service/drive-service-list";
import type { UploadedFile } from "../../../middleware/file-upload";

export const configureInvoiceRoutes = (company: Company, folderPrefix: FolderPrefix): Express => {
  const invoices = getConfiguredApp();

  invoices.get(buildInvoiceRoute(folderPrefix), async (request, response) => {
    const { quarter, year } = request.params;
    try {
      response.json(await listPdfsInQuarterInYear(company, quarter as Quarter, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  invoices.post(buildInvoiceRoute(folderPrefix), async (request, response) => {
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

  return invoices;
};
