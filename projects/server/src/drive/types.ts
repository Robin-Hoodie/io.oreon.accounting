import { Request, Response } from "express";
import { drive_v3 } from "googleapis";
import Schema$File = drive_v3.Schema$File;

const stringLitArray = <L extends string> (arr: L[]) => arr;

export const quarters = stringLitArray(["Q1", "Q2", "Q3", "Q4"]);

export type Quarter = (typeof quarters)[number];

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FunctionHandler {
  (request: Request, response: Response): void | Promise<void>;
}

export interface SchemaFileWithDefaultFields extends Schema$File {
  id: string;
  name: string;
  mimeType: string;
}
