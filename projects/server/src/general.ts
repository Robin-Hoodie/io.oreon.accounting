import serverless from "serverless-http";
import { configureGeneralRoutes } from "./routes/general-routes";
import { getConfiguredApp } from "./server";

const app = getConfiguredApp();

configureGeneralRoutes(app);

export const handler = serverless(app);
