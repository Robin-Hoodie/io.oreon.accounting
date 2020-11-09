import * as functions from "firebase-functions";
import { DEFAULT_REGION } from "../../utils";
import getConfiguredRouterAndApp from "../../../server";
import { deleteFileOrFolder } from "../../service/drive-service-delete";
import { listPdfsInFolder, listPdfsInQuarterInYear } from "../../service/drive-service-list";
import { Quarter, SchemaFileWithDefaultFields } from "../../types";
import { uploadInvoice } from "../../service/drive-service-create";
import { UploadedFiles } from "../../../middleware/file-upload";

const { router, app } = getConfiguredRouterAndApp("invoices-incoming");

// ----- GET -------

router.get("/", async (request, response) => {
  const { parentFolderId } = request.params as { parentFolderId?: string };
  try {
    response.json(await listPdfsInFolder(parentFolderId));
  } catch (error) {
    response.handleError(error);
  }
});

router.get("/:year/:quarter", async (request, response) => {
  const { quarter, year } = request.params;
  try {
    response.json(await listPdfsInQuarterInYear(quarter as Quarter, year));
  } catch (error) {
    response.handleError(error);
  }
});

// ----- POST -------

router.post("/:year/:quarter", async (request, response) => {
  const { quarter, year } = request.params as { quarter: Quarter, year: string };
  const uploadedInvoices: SchemaFileWithDefaultFields[] = [];
  try {
    // TODO: Is it necessary to cast to unknown first?
    for (const file of Object.values(request.files as unknown as UploadedFiles)) {
      uploadedInvoices.push(await uploadInvoice(year, quarter, file.buffer, file.filename, file.mimetype));
    }
    response.status(201).json(uploadedInvoices);
  } catch (error) {
    response.handleError(error);
  }
});

// ----- DELETE -------

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    await deleteFileOrFolder(id);
    response.status(204).end();
  } catch (error) {
    response.handleError(error);
  }
});

export const files = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(app);
