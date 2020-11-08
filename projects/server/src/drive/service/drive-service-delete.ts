import { getQuarterForYearFolder, getYearFolder } from "./drive-service-get";
import driveService from "../drive-service";
import { Quarter } from "../types";

export const deleteYearFolder = async (year: string): Promise<void> => {
  const yearFolder = await getYearFolder(year);
  // TODO: Handle year folder not found
  await deleteFileOrFolder(yearFolder!.id);
};

export const deleteQuarterFolder = async (year: string, quarter: Quarter) => {
  const quarterFolder = await getQuarterForYearFolder(year, quarter);
  await deleteFileOrFolder(quarterFolder!.id);
};

export const deleteFileOrFolder = async (id: string): Promise<void> => {
  await driveService.files.delete({
    fileId: id
  });
};
