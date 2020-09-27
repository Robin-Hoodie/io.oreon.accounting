import * as functions from "firebase-functions";

export const DEFAULT_REGION = "europe-west2";
const BAD_REQUEST = 400;

export const sendJsonResponse = (response: functions.Response<any>, responseObject: any) => {
  return response.contentType("application/json")
    .end(JSON.stringify(responseObject));
};

export const addParentFolderIdToQuery = (q: string, parentFolderId: string) => {
  return `${q} and '${parentFolderId}' in parents`;
};

export const sendBadRequestResponse = (response: functions.Response<any>, errorObject: any) => {
  response.contentType("application/json")
    .status(BAD_REQUEST)
    .end(JSON.stringify(errorObject));
};
