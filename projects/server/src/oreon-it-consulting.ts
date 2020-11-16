import serverless from "serverless-http";
import { configureYearRoutes } from "./routes/year-routes";
import { serverWithMiddleware } from "./server";
import { configureQuarterRoutes } from "./routes/quarter-routes";
import { configureInvoiceRoutes } from "./routes/invoice-routes";
import { errorHandler } from "./middleware/error-handler";

const app = serverWithMiddleware();

configureYearRoutes(app, {
  company: "OREON_IT_CONSULTING",
  folderPrefix: "invoices-incoming"
});
configureQuarterRoutes(app, {
  company: "OREON_IT_CONSULTING",
  folderPrefix: "invoices-incoming"
});
configureInvoiceRoutes(app, {
  company: "OREON_IT_CONSULTING",
  folderPrefix: "invoices-incoming"
});

app.use(errorHandler);

export const handler = serverless(app);

