import {
  INCOMING_INVOICES_FOLDER_ID,
  INCOMING_INVOICES_FOLDER_NAME,
  MIME_TYPE_FOLDER
} from "./drive-service-constants";
import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import { ServiceError } from "./service-error";

export const getYearFolder = async (year: string): Promise<SchemaFileWithDefaultFields | undefined> => {
  const q =
    addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and name='${INCOMING_INVOICES_FOLDER_NAME}_${year}'`,
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
  async (year: string, quarter: Quarter): Promise<SchemaFileWithDefaultFields | undefined> => {
    const yearFolder = await getYearFolder(year);
    if (yearFolder) {
      const q = addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and 
        name='${INCOMING_INVOICES_FOLDER_NAME}_${year}_${quarter}'`, yearFolder.id);
      const { data: quarterFolder } = await driveService.files.list({ q });
      if (quarterFolder.files?.length) {
        if (quarterFolder.files.length > 1) {
          throw new ServiceError(`More than 2 folders found for quarter ${quarter}`, 400);
        }
        return quarterFolder.files[0] as SchemaFileWithDefaultFields;
      } else {
        throw new ServiceError(`No folder was found for quarter ${quarter} in year ${year}`, 404);
      }
    }
    throw new ServiceError(`No folder was found for year ${year}`, 404);
  };

export const quarterForYearFolderExists = async (year: string, quarter: Quarter): Promise<boolean> => {
  return Boolean(await getQuarterForYearFolder(year, quarter));
};
