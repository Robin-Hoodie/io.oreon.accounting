import { listDriveFolders, listPdfsInFolder } from "../drive/service/drive-service-list";
import { deleteFileOrFolder } from "../drive/service/drive-service-delete";
import { addFolder } from "../drive/service/drive-service-create";
import { getFolder } from "../drive/service/drive-service-get";
import { buildGeneralRoute } from "../utils";
import type { Express } from "express";

export const configureGeneralRoutes = (app: Express): void => {
  app.get(buildGeneralRoute("pdfs"), async (request, response, next) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listPdfsInFolder(parentFolderId as string | undefined));
    } catch (error) {
      next(error);
    }
  });

  app.get(buildGeneralRoute("folders"), async (request, response, next) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listDriveFolders(parentFolderId as string | undefined));
    } catch (error) {
      next(error);
    }
  });

  app.post(buildGeneralRoute("folders"), async (request, response, next) => {
    const { name } = request.body;
    const { parentFolderId } = request.query;
    try {
      response.status(201).json(await addFolder(name, parentFolderId as string | undefined));
    } catch (error) {
      next(error);
    }
  });

  // General get for file or folder
  app.get(buildGeneralRoute(":id"), async (request, response, next) => {
    const { id } = request.params;
    try {
      response.json(await getFolder(id));
    } catch (error) {
      next(error);
    }
  });

  // General delete for file or folder
  app.delete(buildGeneralRoute(":id"), async (request, response, next) => {
    const id = request.params.id;
    try {
      await deleteFileOrFolder(id);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });
};
