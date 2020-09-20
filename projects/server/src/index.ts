import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import env from "dotenv";

env.config({ path: path.resolve(__dirname, "../.env.local") });

admin.initializeApp({
  storageBucket: "oreon-invoices.appspot.com",
  credential: admin.credential.applicationDefault()
});

export const helloWorld = functions.https.onRequest(async (request, response) => {

  const bucket = admin.storage().bucket();
  const files = await bucket.getFiles();
  response.send("Hello from Firebase!");
});
