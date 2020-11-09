import { addQuarterFolderForYear } from "../../service/drive-service-create";
import { getQuarterForYearFolder, getYearFolder } from "../../service/drive-service-get";
import { deleteQuarterFolder, deleteYearFolder } from "../../service/drive-service-delete";
import type { Quarter } from "../../types";
import { listDriveFolders } from "../../service/drive-service-list";
import getConfiguredRouterAndApp from "../../../server";
import * as functions from "firebase-functions";
import { DEFAULT_REGION } from "../../utils";
import { INCOMING_INVOICES_FOLDER_ID } from "../../service/drive-service-constants";

const { router, app } = getConfiguredRouterAndApp("invoices-incoming");

// ----- GET -------

router.get("/", async (request, response) => {
  response.json(await listDriveFolders(INCOMING_INVOICES_FOLDER_ID));
});

router.get("/:year", async (request, response) => {
  const { year } = request.params;
  try {
    const yearFolder = await getYearFolder(year);
    response.json(yearFolder);
  } catch (error) {
    response.handleError(error);
  }
});

router.get("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  try {
    response.json(await getQuarterForYearFolder(year, quarter));
  } catch (error) {
    response.handleError(error);
  }
});

// ----- POST -------

router.post("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params;
  try {
    response.status(201).json(await addQuarterFolderForYear(year, quarter as Quarter));
  } catch (error) {
    response.handleError(error);
  }
});

// ----- DELETE -------

router.delete("/:year", async (request, response) => {
  const { year } = request.params;
  try {
    await deleteYearFolder(year);
    response.status(204).end();
  } catch (error) {
    response.handleError(error);
  }
});

router.delete("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  try {
    await deleteQuarterFolder(year, quarter);
    response.status(204).end();
  } catch (error) {
    response.handleError(error);
  }
});

export const folders = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(app);
