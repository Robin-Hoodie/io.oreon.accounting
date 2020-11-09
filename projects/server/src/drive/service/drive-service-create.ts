import { Params$Resource$Files$Create } from "googleapis/build/src/apis/drive/v3";
import { getQuarterForYearFolder, getYearFolder, quarterForYearFolderExists } from "./drive-service-get";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import driveService from "../drive-service";
import {
  INCOMING_INVOICES_FOLDER_ID,
  INVOICES_INCOMING_FOLDER_NAME,
  MIME_TYPE_FOLDER, ROOT_FOLDER_ID
} from "./drive-service-constants";
import { DOMAIN_OREON, USER_ROBIN_EMAIL } from "../utils";
import { Readable } from "stream";
import { ServiceError } from "./service-error";

export const addQuarterFolderForYear = async (year: string, quarter: Quarter): Promise<SchemaFileWithDefaultFields> => {
  if (await quarterForYearFolderExists(year, quarter)) {
    throw new ServiceError(`Folder for ${quarter} in ${year} already exists`, 400);
  }
  let yearFolder;
  try {
    yearFolder = await getYearFolder(year);
  } catch (error) {
    if (error.statusCode === 404) {
      yearFolder = await addYearFolder(year);
    } else {
      throw error;
    }
  }
  return await addQuarterFolder(year, quarter, yearFolder.id);
};

export const addYearFolder = async (year: string): Promise<SchemaFileWithDefaultFields> => {
  return await addFolder(`${INVOICES_INCOMING_FOLDER_NAME}_${year}`, INCOMING_INVOICES_FOLDER_ID);
};

export const addQuarterFolder = async (year: string, quarter: Quarter, yearFolderId: string) => {
  return await addFolder(`${INVOICES_INCOMING_FOLDER_NAME}_${year}_${quarter}`, yearFolderId);
};

export const addFolder = async (name: string, parentFolderId = ROOT_FOLDER_ID):
  Promise<SchemaFileWithDefaultFields> => {
  const requestBody: Params$Resource$Files$Create = {
    name,
    mimeType: MIME_TYPE_FOLDER
  };
  if (parentFolderId) {
    requestBody.parents = [parentFolderId];
  }
  const { data: createdFolder } = await driveService.files.create({
    requestBody
  }) as { data: SchemaFileWithDefaultFields };
  await setDefaultPermissions(createdFolder.id);
  return createdFolder;
};

export const setDefaultPermissions = async (folderId: string): Promise<void> => {
  await driveService.permissions.create({
    fileId: folderId,
    requestBody: {
      role: "reader",
      type: "domain",
      allowFileDiscovery: false,
      domain: DOMAIN_OREON
    }
  });
  await driveService.permissions.create({
    fileId: folderId,
    requestBody: {
      role: "writer",
      emailAddress: USER_ROBIN_EMAIL,
      type: "user"
    }
  });
};

/// TODO: What if quarter/year folder does not exist?
// TODO: Add parent folder in request
export const uploadInvoice =
  async (year: string, quarter: Quarter, buffer: Buffer, fileName: string, mimeType: string):
    Promise<SchemaFileWithDefaultFields> => {
    const parentFolder = await getQuarterForYearFolder(year, quarter);
    const { data: uploadedInvoice } = await driveService.files.create({
      requestBody: {
        name: fileName,
        parents: [parentFolder.id]
      },
      media: {
        mimeType,
        body: Readable.from(buffer)
      }
    }) as { data: SchemaFileWithDefaultFields };
    await setDefaultPermissions(uploadedInvoice.id);
    return uploadedInvoice;
  };
