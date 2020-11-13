import * as admin from "firebase-admin";
import * as path from "path";
import { config as envConfig } from "dotenv";
import * as functions from "firebase-functions";
import { configureFunctionsForCompany, configureUtilsRoutes } from "./drive/api/functions";
import { DEFAULT_REGION } from "./drive/utils";

envConfig({ path: path.resolve(__dirname, "../.env.local") });

admin.initializeApp({
  storageBucket: "oreon-invoices.appspot.com",
  credential: admin.credential.applicationDefault()
});

const oreon = configureFunctionsForCompany("OREON");
const oreonITConsulting = configureFunctionsForCompany("OREON_IT_CONSULTING");
const utils = functions.region(DEFAULT_REGION).https.onRequest(configureUtilsRoutes());

//TODO: Perhaps we don't need to recreate express app https://stackoverflow.com/questions/54508523/declare-separate-firebase-cloud-functions-and-still-use-express-js
export {
  oreon,
  oreonITConsulting,
  utils
};
