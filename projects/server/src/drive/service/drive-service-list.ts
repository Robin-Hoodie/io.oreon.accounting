import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import { MIME_TYPE_FOLDER, MIME_TYPE_PDF, INCOMING_INVOICES_FOLDER_ID } from "./drive-service-constants";

export const listDriveFolders = async (parentFolderId?: string): Promise<SchemaFileWithDefaultFields[]> => {
  let q = `mimeType='${MIME_TYPE_FOLDER}'`;
  if (parentFolderId) {
    q = addParentFolderIdToQuery(q, parentFolderId);
  }
  const { data: driveFolders } = await driveService.files.list({
    q
  }) as { data: { files: SchemaFileWithDefaultFields[] } };
  return driveFolders.files;
};

export const listYearFolders = async (): Promise<SchemaFileWithDefaultFields[]> => {
  return await listDriveFolders(INCOMING_INVOICES_FOLDER_ID);
};

export const listDriveFoldersForYear = async (year: string): Promise<SchemaFileWithDefaultFields[]> => {
  const yearFolders = await listYearFolders();
  const yearFolder = yearFolders.find(yearFolder => {
    const yearFromFolder = yearFolder.name?.match(/20\d{2}$/)?.[0];
    return yearFromFolder === year;
  });
  if (yearFolder) {
    return await listDriveFolders(yearFolder.id);
  }
  return [];
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
  return files;
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
    return [];
  };
