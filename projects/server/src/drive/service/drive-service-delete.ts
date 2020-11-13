import { getQuarterForYearFolder, getYearFolder } from "./drive-service-get";
import driveService from "../drive-service";
import { Company, Quarter } from "../types";
import { ServiceError } from "./service-error";

export const deleteYearFolder = async (company: Company, year: string): Promise<void> => {
  const yearFolder = await getYearFolder(company, year);
  await deleteFileOrFolder(yearFolder.id);
};

export const deleteQuarterFolder = async (company: Company, year: string, quarter: Quarter): Promise<void> => {
  const quarterFolder = await getQuarterForYearFolder(company, year, quarter);
  await deleteFileOrFolder(quarterFolder.id);
};

export const deleteFileOrFolder = async (id: string): Promise<void> => {
  try {
    await driveService.files.delete({
      fileId: id
    });
  } catch (error) {
    if (error.response?.status === 404) {
      throw new ServiceError(`No file or folder with id ${id} was found`, 404);
    }
    throw error;
  }
};
