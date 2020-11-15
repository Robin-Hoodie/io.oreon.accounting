import { drive_v3 } from "googleapis";

const stringLitArray = <L extends string> (arr: L[]) => arr;

export const quarters = stringLitArray(["Q1", "Q2", "Q3", "Q4"]);

export type Quarter = (typeof quarters)[number];

export interface SchemaFileWithDefaultFields extends drive_v3.Schema$File {
  id: string;
  name: string;
  mimeType: string;
}

export type Company = "OREON" | "OREON_IT_CONSULTING";
export type FolderPrefix = "invoices-incoming" | "invoices-outgoing";

export interface RouteConfig {
  company: Company;
  folderPrefix: FolderPrefix
}
