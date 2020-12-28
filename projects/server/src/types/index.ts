import type { ReadStream } from "fs";

const stringLitArray = <L extends string> (arr: L[]) => arr;

export const quarters = stringLitArray(["Q1", "Q2", "Q3", "Q4"]);

export type Quarter = (typeof quarters)[number];

export interface FilePayload {
  mimetype: string;
  filename: string;
  createReadStream: () => ReadStream;
}
