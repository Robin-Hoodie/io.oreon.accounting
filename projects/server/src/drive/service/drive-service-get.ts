import {
  INCOMING_INVOICES_FOLDER_ID,
  INCOMING_INVOICES_FOLDER_NAME,
  MIME_TYPE_FOLDER
} from "./drive-service-constants";
import { addParentFolderIdToQuery } from "./drive-service-utils";
import driveService from "../drive-service";
import { Quarter, SchemaFileWithDefaultFields } from "../types";

export const getYearFolder = async (year: string): Promise<SchemaFileWithDefaultFields | undefined> => {
  const q =
    addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and name='${INCOMING_INVOICES_FOLDER_NAME}_${year}'`,
      INCOMING_INVOICES_FOLDER_ID);
  const { data: yearFolderData } = await driveService.files.list({ q });
  if (yearFolderData.files) {
    if (yearFolderData.files.length > 1) {
      throw new Error(`More than 2 folders found for year ${year}`);
    }
    return yearFolderData.files[0] as SchemaFileWithDefaultFields;
  }
  return;
};

export const getQuarterForYearFolder =
  async (year: string, quarter: Quarter): Promise<SchemaFileWithDefaultFields | undefined> => {
    const yearFolder = await getYearFolder(year);
    if (yearFolder) {
      const q =
        addParentFolderIdToQuery(`mimeType='${MIME_TYPE_FOLDER}' and 
        name='${INCOMING_INVOICES_FOLDER_NAME}_${year}_${quarter}'`, yearFolder.id);
      const { data: quarterFolder } = await driveService.files.list({ q });
      if (quarterFolder.files) {
        if (quarterFolder.files.length > 1) {
          throw new Error(`More than 2 folders found for quarter ${quarter}`);
        }
        return quarterFolder.files[0] as SchemaFileWithDefaultFields;
      }
    }
    return;
  };

export const quarterForYearFolderExists = async (year: string, quarter: Quarter): Promise<boolean> => {
  return Boolean(await getQuarterForYearFolder(year, quarter));
};
