import { addFolder, addQuarterFolderForYear } from "../../service/drive-service-create";
import { getFolder, getQuarterForYearFolder, getYearFolder } from "../../service/drive-service-get";
import { deleteQuarterFolder, deleteYearFolder } from "../../service/drive-service-delete";
import type { Quarter } from "../../types";
import { listDriveFolders } from "../../service/drive-service-list";
import getConfiguredRouterAndApp from "../../../server";
import * as functions from "firebase-functions";
import { DEFAULT_REGION, EXPRESS_QUARTER_REGEX, EXPRESS_YEAR_REGEX } from "../../utils";

const { router, app } = getConfiguredRouterAndApp("invoices-incoming");

// ----- GET -------

router.get("/", async (request, response) => {
  const { parentFolderId } = request.query;
  try {
    response.json(await listDriveFolders(parentFolderId as string | undefined));
  } catch (error) {
    response.handleError(error);
  }
});

router.get(`/:year(${EXPRESS_YEAR_REGEX})`, async (request, response) => {
  const { year } = request.params;
  try {
    response.json(await getYearFolder(year));
  } catch (error) {
    response.handleError(error);
  }
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  try {
    response.json(await getFolder(id));
  } catch (error) {
    response.handleError(error);
  }
});

router.get(`/:year(${EXPRESS_YEAR_REGEX})/:quarter(${EXPRESS_QUARTER_REGEX})`, async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  try {
    response.json(await getQuarterForYearFolder(year, quarter));
  } catch (error) {
    response.handleError(error);
  }
});

// ----- POST -------

router.post(`/:year(${EXPRESS_YEAR_REGEX})/:quarter(${EXPRESS_QUARTER_REGEX})`, async (request, response) => {
  const { year, quarter } = request.params;
  try {
    response.status(201).json(await addQuarterFolderForYear(year, quarter as Quarter));
  } catch (error) {
    response.handleError(error);
  }
});

router.post("/:name", async (request, response) => {
  const { name } = request.params;
  const { parentFolderId } = request.query;
  try {
    response.status(201).json(await addFolder(name, parentFolderId as string | undefined));
  } catch (error) {
    response.handleError(error);
  }
});

// ----- DELETE -------

router.delete(`/:year(${EXPRESS_YEAR_REGEX})`, async (request, response) => {
  const { year } = request.params;
  try {
    await deleteYearFolder(year);
    response.status(204).end();
  } catch (error) {
    response.handleError(error);
  }
});

router.delete(`/:year(${EXPRESS_YEAR_REGEX})/:quarter(${EXPRESS_QUARTER_REGEX})`, async (request, response) => {
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
