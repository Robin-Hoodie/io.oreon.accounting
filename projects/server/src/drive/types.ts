import { Request, Response } from "express";

const stringLitArray = <L extends string>(arr: L[]) => arr;

export const quarters = stringLitArray(["Q1", "Q2", "Q3", "Q4"]);

export type Quarter = (typeof quarters)[number];
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface FunctionHandler {
  (request: Request, response: Response): void | Promise<void>;
}
