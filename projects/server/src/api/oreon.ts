import serverless from "serverless-http";
import { configureYearRoutes } from "./routes/year-routes";
import { getConfiguredApp } from "../server";
import { configureQuarterRoutes } from "./routes/quarter-routes";
import { configureInvoiceRoutes } from "./routes/invoice-routes";

const app = getConfiguredApp();

configureYearRoutes(app, {
  company: "OREON",
  folderPrefix: "invoices-incoming"
});
configureQuarterRoutes(app, {
  company: "OREON",
  folderPrefix: "invoices-incoming"
});
configureInvoiceRoutes(app, {
  company: "OREON",
  folderPrefix: "invoices-incoming"
});

export const handler = serverless(app);
