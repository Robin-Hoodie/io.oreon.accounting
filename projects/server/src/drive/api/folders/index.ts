import { addQuarterFolderForYear } from "../../service/drive-service-create";
import { getQuarterForYearFolder } from "../../service/drive-service-get";
import { deleteFile, deleteQuarterFolder, deleteYearFolder } from "../../service/drive-service-delete";
import type { Quarter } from "../../types";
import { listDriveFolders, listDriveFoldersForYear } from "../../service/drive-service-list";
import getConfiguredExpressApp from "../../../server";
import * as functions from "firebase-functions";
import { DEFAULT_REGION } from "../../utils";
import { INCOMING_INVOICES_FOLDER_ID } from "../../service/drive-service-constants";

const app = getConfiguredExpressApp();

app.get("/invoices-incoming/", async (request, response) => {
  return response.json(await listDriveFolders(INCOMING_INVOICES_FOLDER_ID));
});

app.get("/invoices-incoming/:year", async (request, response) => {
  const { year } = request.params;
  return response.json(await listDriveFoldersForYear(year));
});

app.get("/invoices-incoming/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  const quarterFolderForYear = await getQuarterForYearFolder(year, quarter);
  return response.json(quarterFolderForYear);
});

app.post("/invoices-incoming/:year/:quarter", async (request, response) => {
  const { year, quarter } = request.params;
  const createdQuarterFolder = await addQuarterFolderForYear(year, quarter as Quarter);
  return response.status(201).json(createdQuarterFolder);
});

app.delete("/invoices-incoming/:year", async (request, response) => {
  const { year } = request.params;
  await deleteYearFolder(year);
  // TODO: Add deleted folder details in response
  return response.end();
});

app.delete("/invoices-incoming/:year/:quarter", async (request, response) => {
  console.log("Folder")
  const { year, quarter } = request.params as { year: string, quarter: Quarter };
  await deleteQuarterFolder(year, quarter);
  // TODO: Add deleted folder details in response
  return response.end();
});

app.delete("/invoices-incoming/:id", async (request, response) => {
  const { id } = request.params as { id: string};
  await deleteFile(id);
  // TODO: Add deleted file/folder details i nresponse
  return response.end();
})

export const folders = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(app);
