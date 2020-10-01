import { Quarter, quarters } from "./types";

export const isQuarter = (str: any): str is Quarter => quarters.includes(str);
export const isYear = (str: string) => /\d{4}/.test(str);
