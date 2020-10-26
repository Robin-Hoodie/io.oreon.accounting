import * as admin from "firebase-admin";
import * as path from "path";
import { config as envConfig } from "dotenv";
import { files } from "./drive/api/files";
import { folders } from "./drive/api/folders";

envConfig({ path: path.resolve(__dirname, "../.env.local") });

admin.initializeApp({
  storageBucket: "oreon-invoices.appspot.com",
  credential: admin.credential.applicationDefault()
});

export {
  folders,
  files
};

