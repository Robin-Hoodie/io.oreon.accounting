import { listDriveFolders, listPdfsInFolder } from "../../service/drive-service-list";
import { getConfiguredApp } from "../../../server";
import { deleteFileOrFolder } from "../../service/drive-service-delete";
import { addFolder } from "../../service/drive-service-create";
import type { Express } from "express";
import { getFolder } from "../../service/drive-service-get";

export const configureUtilsRoutes = (): Express => {
  const utils = getConfiguredApp();

  utils.get("/files", async (request, response) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listPdfsInFolder(parentFolderId as string | undefined));
    } catch (error) {
      response.handleError(error);
    }
  });

  utils.get("/folders", async (request, response) => {
    const { parentFolderId } = request.query;
    try {
      response.json(await listDriveFolders(parentFolderId as string | undefined));
    } catch (error) {
      response.handleError(error);
    }
  });

  utils.post("/folders", async (request, response) => {
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
  utils.get("/:id", async (request, response) => {
    const { id } = request.params;
    try {
      response.json(await getFolder(id));
    } catch (error) {
      response.handleError(error);
    }
  });

  // General delete for file or folder
  utils.delete("/:id", async (request, response) => {
    const id = request.params.id;
    try {
      await deleteFileOrFolder(id);
      response.status(204).end();
    } catch (error) {
      response.handleError(error);
    }
  });

  return utils;
};
