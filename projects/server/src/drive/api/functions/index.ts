import { region } from "firebase-functions";
import { DEFAULT_REGION } from "../../utils";
import { configureYearRoutes } from "../folders/years";
import { configureQuarterRoutes } from "../folders/quarters";
import type { Company, FirebaseFunctions } from "../../types";
import { configureInvoiceRoutes } from "../folders/invoices";

// TODO: Group all routes under one function? Will allow us to have cleaner routes
export const configureFunctionsForCompany = (company: Company): FirebaseFunctions => {
  const years = region(DEFAULT_REGION).https.onRequest(configureYearRoutes(company, "/invoices-incoming"));
  const quarters = region(DEFAULT_REGION).https.onRequest(configureQuarterRoutes(company, "/invoices-incoming"));
  const invoices = region(DEFAULT_REGION).https.onRequest(configureInvoiceRoutes(company, "/invoices-incoming"));

  // TODO: Add for outgoing invoices

  return {
    years,
    quarters,
    invoices
  };
};

export { configureUtilsRoutes } from "../folders/utils";
