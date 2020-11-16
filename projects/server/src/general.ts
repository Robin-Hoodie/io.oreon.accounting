import serverless from "serverless-http";
import { configureGeneralRoutes } from "./routes/general-routes";
import { serverWithMiddleware } from "./server";
import { errorHandler } from "./middleware/error-handler";

const app = serverWithMiddleware();

configureGeneralRoutes(app);

app.use(errorHandler);

export const handler = serverless(app);
