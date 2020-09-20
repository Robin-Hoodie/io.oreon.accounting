import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import type { File } from "@google-cloud/storage";
import CollectionReference = admin.firestore.CollectionReference;

const firestore = admin.firestore();
const storage = admin.storage();

export const syncFilesWithDb = functions.runWith({ timeoutSeconds: 540 })
  .https
  .onRequest(async (_, response) => {
    const incomingInvoices = "incoming-invoices";
    const collection = firestore.collection(incomingInvoices);
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles({
      directory: "incoming-invoices"
    });
    let docsAddedCounter = 0;
    for (const file of files) {
      const docAdded = await addDocumentForFile(collection, file);
      if (docAdded) {
        docsAddedCounter++;
      }
    }
    response.end(`Added ${docsAddedCounter} docs to collection ${incomingInvoices}`);
  });

const isRC = (file: File) => /-rc\./i.test(file.name);

const addDocumentForFile = async (collection: CollectionReference, file: File) => {
  const [metadata] = await file.getMetadata();
  const docId = file.name.slice(file.name.indexOf("/") + 1);
  const docRef = await collection.doc(docId);
  const doc = await docRef.get();
  if (doc.exists) {
    return false;
  }
  docRef.set({
    quarter: metadata.metadata.quarter,
    year: metadata.metadata.year,
    fileName: file.name,
    rc: isRC(file),
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  return true;
};
