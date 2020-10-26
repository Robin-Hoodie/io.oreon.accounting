import * as functions from "firebase-functions";
import Busboy from "busboy";
import { DEFAULT_REGION } from "../../utils";
import getConfiguredRouterAndApp from "../../../server";
import { deleteFileOrFolder as deleteFileFromService } from "../../service/drive-service-delete";
import { listPdfsInFolder, listPdfsInQuarterInYear } from "../../service/drive-service-list";
import { Quarter } from "../../types";
import { uploadInvoice } from "../../service/drive-service-create";

const { router, app } = getConfiguredRouterAndApp("invoices-incoming");

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await deleteFileFromService(id);
  // TODO: add deleted file info
  response.end();
});

router.get("/", async (request, response) => {
  const { parentFolderId } = request.params as { parentFolderId?: string };
  response.json(await listPdfsInFolder(parentFolderId));
});

router.get("/:year/:quarter", async (request, response) => {
  const { quarter, year } = request.params;
  response.json(await listPdfsInQuarterInYear(quarter as Quarter, year));
});

router.post("/:year/:quarter", async (request, response) => {
  const { quarter, year } = request.params as { quarter: Quarter, year: string };
  const busboy = new Busboy({
    headers: request.headers,
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  });
  busboy.on("file", async (_, file, filename, __, mimeType) => {
    await uploadInvoice(year, quarter, file, filename, mimeType);
  });
  busboy.on("finish", () => {
    console.log("File finished");
    response.end();
  });
  busboy.end(request.rawBody)
});

export const files = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(app);
