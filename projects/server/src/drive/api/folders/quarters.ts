import type { Express } from "express";
import { buildQuarterRoute } from "../../utils";
import { addQuarterFolderForYear } from "../../service/drive-service-create";
import { getConfiguredApp } from "../../../server";
import { deleteQuarterFolder } from "../../service/drive-service-delete";
import { getQuarterForYearFolder } from "../../service/drive-service-get";
import type { Company, FolderPrefix, Quarter } from "../../types";

export const configureQuarterRoutes = (company: Company, folderPrefix: FolderPrefix): Express => {
  const quarters = getConfiguredApp();

  quarters.get(buildQuarterRoute(folderPrefix, true),async (request, response) => {
      const { year, quarter } = request.params as { year: string, quarter: Quarter };
      try {
        response.json(await getQuarterForYearFolder(company, year, quarter));
      } catch (error) {
        response.handleError(error);
      }
    });

  quarters.post(buildQuarterRoute(folderPrefix), async (request, response) => {
    const { year } = request.params;
    const { quarter } = request.body as { quarter: Quarter};
    try {
      response.status(201).json(await addQuarterFolderForYear(company, year, quarter));
    } catch (error) {
      response.handleError(error);
    }
  });

  quarters.delete(buildQuarterRoute(folderPrefix, true), async (request, response) => {
    const { year, quarter } = request.params as { year: string, quarter: Quarter };
    try {
      await deleteQuarterFolder(company, year, quarter);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });

  return quarters;
};
