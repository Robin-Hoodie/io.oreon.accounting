import * as admin from "firebase-admin";
import * as path from "path";
import { config as envConfig } from "dotenv";

let initialized = false;

export const initialize = (): void => {
  if (!initialized) {
    envConfig({ path: path.resolve(__dirname, "../.env.local") });

    admin.initializeApp({
      storageBucket: "oreon-accounting.appspot.com",
      credential: admin.credential.applicationDefault()
    });
    initialized = true;
  }
};
