import { addQuarterFolderForYear } from "../../service/drive-service-create";
import { getQuarterForYearFolder } from "../../service/drive-service-get";
import { deleteFileOrFolder, deleteQuarterFolder, deleteYearFolder } from "../../service/drive-service-delete";
import type { Quarter } from "../../types";
import { listDriveFolders, listDriveFoldersForYear } from "../../service/drive-service-list";
import getConfiguredRouterAndApp from "../../../server";
import * as functions from "firebase-functions";
import { DEFAULT_REGION } from "../../utils";
import { INCOMING_INVOICES_FOLDER_ID } from "../../service/drive-service-constants";

const { router, app } = getConfiguredRouterAndApp("invoices-incoming");

router.get("/", async (request, response) => {
  response.json(await listDriveFolders(INCOMING_INVOICES_FOLDER_ID));
});

router.get("/:year", async (request, response) => {
  const { year } = request.params;
  response.json(await listDriveFoldersForYear(year));
});

router.get("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  const quarterFolderForYear = await getQuarterForYearFolder(year, quarter);
  response.json(quarterFolderForYear);
});

router.post("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params;
  const createdQuarterFolder = await addQuarterFolderForYear(year, quarter as Quarter);
  response.status(201).json(createdQuarterFolder);
});

// router.delete(/\\/\d{4}/, async (request, response) => {
//   const { year } = request.params;
//   await deleteYearFolder(year);
//   response.end();
// });

router.delete("/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  try {
    await deleteQuarterFolder(year, quarter);
  } catch (error) {
    response.status(error.code).json({
      message: error.message,
      errors: error.errors
    });
  }
  response.status(204).end();
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params as { id: string };
  try {
    await deleteFileOrFolder(id);
  } catch (error) {
    response.status(error.code).json({
      message: error.message,
      errors: error.errors
    });
  }
  response.status(204).end();
});

export const folders = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(app);
