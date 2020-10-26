import { getQuarterForYearFolder, getYearFolder } from "./drive-service-get";
import driveService from "../drive-service";
import { Quarter } from "../types";

export const deleteYearFolder = async (year: string): Promise<void> => {
  const yearFolder = await getYearFolder(year);
  if (yearFolder) {
    await deleteFile(yearFolder.id);
  }
};

export const deleteQuarterFolder = async (year: string, quarter: Quarter) => {
  const quarterFolder = await getQuarterForYearFolder(year, quarter);
  if (quarterFolder) {
    await deleteFile(quarterFolder.id);
  }
};

export const deleteFile = async (id: string) => {
  await driveService.files.delete({
    fileId: id
  })
}
