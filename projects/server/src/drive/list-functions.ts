import { Schema$File } from "googleapis/build/src/apis/drive/v3";
import driveService from "./service";
import {
  sendJsonResponse,
  addParentFolderIdToQuery,
  sendBadRequestResponse, getFunction, QUARTER_REGEX, YEAR_REGEX
} from "./utils";
import { Quarter } from "./types";

// const firestore = admin.firestore();
// const storage = admin.storage();
const INCOMING_INVOICES_FOLDER_ID = "1fIju8aJykOLwKeMj4_-C5WYGh3O86a-_";

// GET /invoices?parentFolderId
export const invoices = getFunction(async (request, response) => {
  const { parentFolderId } = request.params as { parentFolderId?: string };
  return sendJsonResponse(response, await listPdfsInFolder(parentFolderId));
});

// GET /invoicesForQuarterForYear/:year/:quarter
export const invoicesForQuarterForYear = getFunction(async (request, response) => {
  const quarter = request.path.match(QUARTER_REGEX)?.[0] as Quarter | undefined;
  const year = request.path.match(YEAR_REGEX)?.[0];
  if (quarter && year) {
    sendJsonResponse(response, await listPdfsInQuarterInYear(quarter, year));
  }
  const errorMessage = "URL has missing/invalid path parameter(s). " +
    "Please use the following format: /invoicesForQuarterForYear/:year/:quarter where 'year'" +
    "should be a number from 2010 to 2099 and 'quarter' should be one of 'Q1', 'Q2', 'Q3' or 'Q4'";
  let invalidPathParams: string[] = [];
  if (!quarter) {
    invalidPathParams = [...invalidPathParams, "quarter"];
  }
  if (!year) {
    invalidPathParams = [...invalidPathParams, "year"];
  }
  sendBadRequestResponse(response, {
    errorMessage,
    invalidPathParams
  });
});

// GET /folders?parentFolderId
export const folders = getFunction(async (request, response) => {
  const { parentFolderId } = request.query as { parentFolderId?: string };
  sendJsonResponse(response, await listDriveFolders(parentFolderId));
});

// GET /foldersForYear/:year
export const foldersForYear = getFunction(async (request, response) => {
  const year = request.path.match(YEAR_REGEX)?.[0];
  if (year) {
    sendJsonResponse(response, await listDriveFoldersForYear(year));
  }
  sendBadRequestResponse(response, {
    errorMessage: "URL is missing path parameter 'year'. " +
      "Please use the following format: /foldersForYear/:year where 'year' should be a number from 2010 to 2099"
  });
});

const listDriveFolders = async (parentFolderId?: string): Promise<Schema$File> => {
  let q = "mimeType='application/vnd.google-apps.folder'";
  if (parentFolderId) {
    q = addParentFolderIdToQuery(q, parentFolderId);
  }
  const { data: driveFolders } = await driveService.files.list({
    q
  }) as { data: { files: Schema$File[] } };
  return driveFolders.files;
};

const listYearFolders = async (): Promise<Schema$File[]> => {
  return await listDriveFolders(INCOMING_INVOICES_FOLDER_ID);
};

const listDriveFoldersForYear = async (year: string): Promise<Schema$File[]> => {
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

const listPdfsInFolder = async (parentFolderId?: string): Promise<Schema$File[]> => {
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
