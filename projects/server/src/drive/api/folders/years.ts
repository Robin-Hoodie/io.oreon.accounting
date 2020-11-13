import { buildYearRoute } from "../../utils";
import { getYearFolder } from "../../service/drive-service-get";
import { deleteYearFolder } from "../../service/drive-service-delete";
import { getConfiguredApp } from "../../../server";
import type { Express } from "express";
import { Company, FolderPrefix } from "../../types";
import { addYearFolder } from "../../service/drive-service-create";

const configureYearRoutes = (company: Company, folderPrefix: FolderPrefix): Express => {
  const years = getConfiguredApp();

  years.get(buildYearRoute(folderPrefix, true), async (request, response) => {
    const { year } = request.params;
    try {
      response.json(await getYearFolder(company, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  years.post(buildYearRoute(folderPrefix), async (request, response) => {
    const { year } = request.body as { year: string };
    try {
      response.status(201).json(await addYearFolder(company, year));
    } catch (error) {
      response.handleError(error);
    }
  });

  years.delete(buildYearRoute(folderPrefix, true), async (request, response) => {
    const { year } = request.params;
    try {
      await deleteYearFolder(company, year);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });

  return years;
};

export { configureYearRoutes };
