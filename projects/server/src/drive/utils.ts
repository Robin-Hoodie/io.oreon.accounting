import * as functions from "firebase-functions";
import { FunctionHandler, HttpMethod } from "@/drive/types";
export const DEFAULT_REGION = "europe-west2";
export const USER_ROBIN_EMAIL = "robin@oreon.io";

const BAD_REQUEST = 400;
const METHOD_NOT_ALLOWED = 405;

export const sendJsonResponse = (response: functions.Response<any>, responseObject: any) => {
  response.contentType("application/json")
    .end(JSON.stringify(responseObject));
};
export const sendBadRequestResponse = (response: functions.Response<any>, errorObject: any) => {
  response.contentType("application/json")
    .status(BAD_REQUEST)
    .end(JSON.stringify(errorObject));
};

export const addParentFolderIdToQuery = (q: string, parentFolderId: string) => {
  return `${q} and '${parentFolderId}' in parents`;
};

export const httpsFunction = (allowedMethods: HttpMethod[],
                              handler: FunctionHandler) => {
  return functions
    .https
    .onRequest(async (request, response) => {
      if (!allowedMethods.includes(request.method as HttpMethod)) {
        return response
          .status(METHOD_NOT_ALLOWED)
          .header("Allow", allowedMethods.join(", "))
          .end();
      }
      await handler(request, response);
    });
};

export const getFunction = (handler: FunctionHandler) => {
  return httpsFunction(["GET"], handler);
}

export const postFunction = (handler: FunctionHandler) => {
  return httpsFunction(["GET"], handler);
}
