import { Request, Response } from "express";

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface FunctionHandler {
  (request: Request, response: Response): void | Promise<void>;
}
