import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import { MIME_TYPE_FOLDER, MIME_TYPE_PDF, INCOMING_INVOICES_FOLDER_ID } from "./drive-service-constants";
import { ServiceError } from "./service-error";

export const listDriveFolders = async (parentFolderId?: string): Promise<SchemaFileWithDefaultFields[]> => {
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
  const message = parentFolderId ? `No folders were found in folder with id ${parentFolderId}` : "No folders were found";
  throw new ServiceError(message, 404);
};

export const listDriveFoldersForYear = async (year: string): Promise<SchemaFileWithDefaultFields[]> => {
  const yearFolders = await listDriveFolders(INCOMING_INVOICES_FOLDER_ID);
  const yearFolder = yearFolders.find(yearFolder => {
    const yearFromFolder = yearFolder.name?.match(/20\d{2}$/)?.[0];
    return yearFromFolder === year;
  });
  if (yearFolder) {
    return await listDriveFolders(yearFolder.id);
  }
  throw new ServiceError(`Folder for year ${year} was not found`, 404);
};

export const listPdfsInFolder = async (parentFolderId?: string): Promise<SchemaFileWithDefaultFields[]> => {
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
  async (quarter: Quarter, year: string): Promise<SchemaFileWithDefaultFields[]> => {
    const quarterFolders = await listDriveFoldersForYear(year);
    const quarterFolder = quarterFolders.find(quarterFolder => {
      const quarterFromFolder = quarterFolder.name?.match(/Q\d/)?.[0];
      return quarterFromFolder === quarter;
    });
    if (quarterFolder) {
      return listPdfsInFolder(quarterFolder.id);
    }
    throw new ServiceError(`No folder for quarter ${quarter} was found for year ${year}`, 404);
  };
