import {
  INCOMING_INVOICES_FOLDER_ID,
  INVOICES_INCOMING_FOLDER_NAME,
  MIME_TYPE_FOLDER
} from "./drive-service-constants";
import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import { ServiceError } from "./service-error";
import { drive_v3 } from "googleapis";
import Schema$File = drive_v3.Schema$File;

export const getFolder = async (id: string): Promise<Required<Schema$File>> => {
  const { data: folder } = await driveService.files.get({ fileId: id, fields: "*" });
  if (folder) {
    return folder as Required<Schema$File>;
  }
  throw new ServiceError(`No folder with id ${id} was found`, 404);
};

export const getYearFolder = async (year: string): Promise<SchemaFileWithDefaultFields> => {
  const q =
    addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and name='${INVOICES_INCOMING_FOLDER_NAME}_${year}'`,
      INCOMING_INVOICES_FOLDER_ID);
  const { data: yearFolderData } = await driveService.files.list({ q });
  if (yearFolderData.files?.length) {
    if (yearFolderData.files.length > 1) {
      throw new ServiceError(`More than 2 folders found for year ${year}`, 400);
    }
    return yearFolderData.files[0] as SchemaFileWithDefaultFields;
  }
  throw new ServiceError(`No folder was found for year ${year}`, 404);
};

export const getQuarterForYearFolder =
  async (year: string, quarter: Quarter): Promise<SchemaFileWithDefaultFields> => {
    const yearFolder = await getYearFolder(year);
    if (yearFolder) {
      const q = addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and 
        name='${INVOICES_INCOMING_FOLDER_NAME}_${year}_${quarter}'`, yearFolder.id);
      const { data: quarterFolder } = await driveService.files.list({ q });
      if (quarterFolder.files?.length) {
        if (quarterFolder.files.length > 1) {
          throw new ServiceError(`More than 2 folders found for quarter ${quarter}`, 400);
        }
        return quarterFolder.files[0] as SchemaFileWithDefaultFields;
      }
      throw new ServiceError(`No folder was found for quarter ${quarter} in year ${year}`, 404);
    }
    throw new ServiceError(`No folder was found for year ${year}`, 404);
  };

export const quarterForYearFolderExists = async (year: string, quarter: Quarter): Promise<boolean> => {
  try {
    await getQuarterForYearFolder(year, quarter)
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
};
