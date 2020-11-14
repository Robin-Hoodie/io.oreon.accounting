import serverless from "serverless-http";
import { configureUtilsRoutes } from "./routes/util-routes";
import { getConfiguredApp } from "../server";

const app = getConfiguredApp();

configureUtilsRoutes(app);

export const handler = serverless(app);
