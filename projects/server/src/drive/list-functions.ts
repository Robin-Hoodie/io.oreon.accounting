import * as functions from "firebase-functions";
import { Schema$File } from "googleapis/build/src/apis/drive/v3";
import driveService from "./service";
import {
  sendJsonResponse,
  addParentFolderIdToQuery,
  DEFAULT_REGION,
  sendBadRequestResponse
} from "./utils";
import { Quarter } from "./types";

// const firestore = admin.firestore();
// const storage = admin.storage();
const INCOMING_INVOICES_FOLDER_ID = "1fIju8aJykOLwKeMj4_-C5WYGh3O86a-_";

// GET /invoices?parentFolderId
export const invoices = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(async (request, response) => {
    const { parentFolderId } = request.params as { parentFolderId?: string };
    return sendJsonResponse(response, await listPdfsInFolder(parentFolderId));
  });

// GET /invoicesForQuarterForYear/:year/:quarter
export const invoicesForQuarterForYear = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(async (request, response) => {
    const quarter = request.path.match(/(?<=\/)Q[1-4]/)?.[0] as Quarter | undefined;
    const year = request.path.match(/(?<=\/)\d{4}/)?.[0];
    if (quarter && year) {
      return sendJsonResponse(response, await listPdfsInQuarterInYear(quarter, year));
    }
    let errorMessage = "URL is missing path parameter(s)";
    if (!quarter) {
      errorMessage += " 'quarter'";
    }
    if (!year) {
      if (!quarter) {
        errorMessage += " and";
      }
      errorMessage += " 'year'";
    }
    errorMessage += ". Please use the following format: /invoicesForQuarterForYear/:year/:quarter";
    return sendBadRequestResponse(response, {
      errorMessage
    });
  });

// GET /folders?parentFolderId
export const folders = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(async (request, response) => {
    const { parentFolderId } = request.query as { parentFolderId?: string };
    return sendJsonResponse(response, await listDriveFolders(parentFolderId));
  });

// GET /foldersForYear/:year
export const foldersForYear = functions
  .region(DEFAULT_REGION)
  .https
  .onRequest(async (request, response) => {
    const year = request.path.match(/(?<=\/)\d{4}/)?.[0];
    if (year) {
      return sendJsonResponse(response, await listDriveFoldersForYear(year));
    }
    return sendBadRequestResponse(response, {
      errorMessage: "URL is missing path parameter 'year'. Please use the following format: /foldersForYear/:year"
    });
  });

const listDriveFolders = async (parentFolderId?: string): Promise<Schema$File> => {
  let q = "mimeType='application/vnd.google-apps.folder'";
  if (parentFolderId) {
    q = addParentFolderIdToQuery(q, parentFolderId);
  }
  const { data: driveFolders } = await driveService.files.list({
    q
  }) as { data: { files: Schema$File[]}};
  return driveFolders.files;
};

const listYearFolders = async (): Promise<Schema$File> => {
  return await listDriveFolders(INCOMING_INVOICES_FOLDER_ID);
};

const listDriveFoldersForYear = async (year: string): Promise<Schema$File> => {
  const yearFolders = await listYearFolders();
  const yearFolder: Schema$File & { id: string } = yearFolders.find(yearFolder => {
    const yearFromFolder = yearFolder.name?.match(/20\d{2}$/)?.[0];
    return yearFromFolder === year;
  });
  if (yearFolder) {
    return await listDriveFolders(yearFolder.id);
  }
  return [];
};

const listPdfsInFolder = async (parentFolderId?: string): Promise<Schema$File> => {
  let q = "mimeType='application/pdf'";
  if (parentFolderId) {
    q = addParentFolderIdToQuery(q, parentFolderId);
  }
  const { data } = await driveService.files.list({
    q
  });
  let { files, nextPageToken } = data as { files: Schema$File[], nextPageToken?: string | null };
  while (nextPageToken) {
    const { data } = await driveService.files.list({
      q,
      pageToken: nextPageToken
    });
    files = [
      ...files,
      data.files
    ];
    nextPageToken = data.nextPageToken;
  }
  return files;
};

const listPdfsInQuarterInYear = async (quarter: Quarter, year: string) => {
  const quarterFolders = await listDriveFoldersForYear(year);
  const quarterFolder: Schema$File & { id: string } = quarterFolders.find(quarterFolder => {
    const quarterFromFolder = quarterFolder.name?.match(/Q\d/)?.[0];
    return quarterFromFolder === quarter;
  });
  if (quarterFolder) {
    return listPdfsInFolder(quarterFolder.id);
  }
  return [];
};
