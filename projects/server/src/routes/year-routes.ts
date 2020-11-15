import { RouteConfig } from "../types";
import { buildYearRoute } from "../utils";
import { getYearFolder } from "../drive/service/drive-service-get";
import { addYearFolder } from "../drive/service/drive-service-create";
import { deleteYearFolder } from "../drive/service/drive-service-delete";
import type { Express } from "express";

export const configureYearRoutes = (app: Express, { company, folderPrefix }: RouteConfig): void => {
  app.get(buildYearRoute(company, folderPrefix, true), async (request, response) => {
    const { year } = request.params;
    try {
      response.json(await getYearFolder(company, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.post(buildYearRoute(company, folderPrefix), async (request, response) => {
    const { year } = request.body as { year: string };
    try {
      response.status(201).json(await addYearFolder(company, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.delete(buildYearRoute(company, folderPrefix, true), async (request, response) => {
    const { year } = request.params;
    try {
      await deleteYearFolder(company, year);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });

};
