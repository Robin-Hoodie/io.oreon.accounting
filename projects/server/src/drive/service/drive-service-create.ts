import { getQuarterForYearFolder, getYearFolder, quarterForYearFolderExists } from "./drive-service-get";
import { Quarter, SchemaFileWithDefaultFields } from "../types";
import driveService from "../drive-service";
import {
  INCOMING_INVOICES_FOLDER_ID,
  INCOMING_INVOICES_FOLDER_NAME,
  MIME_TYPE_FOLDER
} from "./drive-service-constants";
import { DOMAIN_OREON, USER_ROBIN_EMAIL } from "../utils";
import { Readable } from "stream";

export const addQuarterFolderForYear = async (year: string, quarter: Quarter): Promise<SchemaFileWithDefaultFields> => {
  if (await quarterForYearFolderExists(year, quarter)) {
    throw new Error(`Folder for ${quarter} in ${year} already exists!`);
  }
  let yearFolder = await getYearFolder(year);
  if (!yearFolder) {
    yearFolder = await addYearFolder(year);
  }
  const { data: createdQuarterFolder } = await driveService.files.create({
    requestBody: {
      name: `${INCOMING_INVOICES_FOLDER_NAME}_${year}_${quarter}`,
      parents: [yearFolder.id],
      mimeType: MIME_TYPE_FOLDER
    }
  }) as { data: SchemaFileWithDefaultFields };
  await setDefaultPermissions(createdQuarterFolder.id);
  return createdQuarterFolder;
};

export const addYearFolder = async (year: string): Promise<SchemaFileWithDefaultFields> => {
  const { data: createdYearFolder } = await driveService.files.create({
    requestBody: {
      name: `${INCOMING_INVOICES_FOLDER_NAME}_${year}`,
      parents: [INCOMING_INVOICES_FOLDER_ID],
      mimeType: MIME_TYPE_FOLDER
    }
  }) as { data: SchemaFileWithDefaultFields };
  await setDefaultPermissions(createdYearFolder.id);
  return createdYearFolder;
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
