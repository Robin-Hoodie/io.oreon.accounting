import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import {
  MIME_TYPE_FOLDER,
  MIME_TYPE_PDF,
  INVOICES_INCOMING_FOLDER_ID,
  ROOT_FOLDER_ID
} from "./drive-service-constants";
import { ServiceError } from "./service-error";
import type { Company, Quarter, SchemaFileWithDefaultFields } from "../types";

export const listDriveFolders = async (parentFolderId = ROOT_FOLDER_ID): Promise<SchemaFileWithDefaultFields[]> => {
  let q = `mimeType='${MIME_TYPE_FOLDER}'`;
  if (parentFolderId) {
    q = addParentFolderIdToQuery(q, parentFolderId);
  }
  const { data: driveFolders } = await driveService.files.list({
    q
  }) as { data: { files: SchemaFileWithDefaultFields[] } };
  if (driveFolders.files.length) {
    return driveFolders.files;
  }
  const message =
    parentFolderId ? `No folders were found in folder with id ${parentFolderId}` : "No folders were found";
  throw new ServiceError(message, 404);
};

export const listDriveFoldersForYear =
  async (company: Company, year: string): Promise<SchemaFileWithDefaultFields[]> => {
    const yearFolders = await listDriveFolders(INVOICES_INCOMING_FOLDER_ID[company]);
    const yearFolder = yearFolders.find(yearFolder => {
      const yearFromFolder = yearFolder.name?.match(/20\d{2}$/)?.[0];
      return yearFromFolder === year;
    });
    if (yearFolder) {
      return await listDriveFolders(yearFolder.id);
    }
    throw new ServiceError(`Folder for year ${year} was not found`, 404);
  };

export const listPdfsInFolder =
  async (parentFolderId = ROOT_FOLDER_ID): Promise<SchemaFileWithDefaultFields[]> => {
    let q = `mimeType='${MIME_TYPE_PDF}'`;
    if (parentFolderId) {
      q = addParentFolderIdToQuery(q, parentFolderId);
    }
    const { data } = await driveService.files.list({
      q
    });
    let { files, nextPageToken } = data as { files: SchemaFileWithDefaultFields[], nextPageToken?: string | null };
    while (nextPageToken) {
      const { data } = await driveService.files.list({
        q,
        pageToken: nextPageToken
      });
      files = [
        ...files,
        ...data.files as SchemaFileWithDefaultFields[]
      ];
      nextPageToken = data.nextPageToken;
    }
    if (files.length) {
      return files;
    }
    const message = parentFolderId ? `No files were found in folder with id ${parentFolderId}` : "No files were found";
    throw new ServiceError(message, 404);
  };

export const listPdfsInQuarterInYear =
  async (company: Company, quarter: Quarter, year: string): Promise<SchemaFileWithDefaultFields[]> => {
    const quarterFolders = await listDriveFoldersForYear(company, year);
    const quarterFolder = quarterFolders.find(quarterFolder => {
      const quarterFromFolder = quarterFolder.name?.match(/Q\d/)?.[0];
      return quarterFromFolder === quarter;
    });
    if (quarterFolder) {
      return listPdfsInFolder(quarterFolder.id);
    }
    throw new ServiceError(`No folder for quarter ${quarter} was found for year ${year}`, 404);
  };
