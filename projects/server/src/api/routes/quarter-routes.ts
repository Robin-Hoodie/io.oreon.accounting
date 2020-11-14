import { buildQuarterRoute } from "../../utils";
import { addQuarterFolderForYear } from "../../drive/service/drive-service-create";
import { deleteQuarterFolder } from "../../drive/service/drive-service-delete";
import { getQuarterForYearFolder } from "../../drive/service/drive-service-get";
import type { Express } from "express";
import type { Quarter, RouteConfig } from "../../types";

export const configureQuarterRoutes = (app: Express, { company, folderPrefix }: RouteConfig): void => {
  app.get(buildQuarterRoute(company, folderPrefix, true), async (request, response) => {
    const { year, quarter } = request.params as { year: string, quarter: Quarter };
    try {
      response.json(await getQuarterForYearFolder(company, year, quarter));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.post(buildQuarterRoute(company, folderPrefix), async (request, response) => {
    const { year } = request.params;
    const { quarter } = request.body as { quarter: Quarter };
    try {
      response.status(201).json(await addQuarterFolderForYear(company, year, quarter));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.delete(buildQuarterRoute(company, folderPrefix, true), async (request, response) => {
    const { year, quarter } = request.params as { year: string, quarter: Quarter };
    try {
      await deleteQuarterFolder(company, year, quarter);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });

};
