import { listDriveFolders, listPdfsInFolder } from "../../drive/service/drive-service-list";
import { deleteFileOrFolder } from "../../drive/service/drive-service-delete";
import { addFolder } from "../../drive/service/drive-service-create";
import { getFolder } from "../../drive/service/drive-service-get";
import { buildUtilsRoute } from "../../utils";
import type { Express } from "express";

export const configureUtilsRoutes = (app: Express): void => {
  app.get(buildUtilsRoute("utils"), async (request, response) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listPdfsInFolder(parentFolderId as string | undefined));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.get(buildUtilsRoute("folders"), async (request, response) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listDriveFolders(parentFolderId as string | undefined));
    } catch (error) {
      response.handleError(error);
    }
  });

  app.post(buildUtilsRoute("folders"), async (request, response) => {
    const { name } = request.body;
    const { parentFolderId } = request.query;
    console.log("name ", name);
    console.log("parentFolderId ", parentFolderId);
    try {
      response.status(201).json(await addFolder(name, parentFolderId as string | undefined));
    } catch (error) {
      response.handleError(error);
    }
  });

  // General get for file or folder
  app.get(buildUtilsRoute(":id"), async (request, response) => {
    const { id } = request.params;
    try {
      response.json(await getFolder(id));
    } catch (error) {
      response.handleError(error);
    }
  });

  // General delete for file or folder
  app.delete(buildUtilsRoute(":id"), async (request, response) => {
    const id = request.params.id;
    try {
      await deleteFileOrFolder(id);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });
};
