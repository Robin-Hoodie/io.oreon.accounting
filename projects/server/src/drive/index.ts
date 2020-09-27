// import { Schema$File } from "googleapis/build/src/apis/drive/v3";
// import driveService from "@/drive/service";
// import { File } from "@google-cloud/storage";
// import * as admin from "firebase-admin";

export * from "./list-functions";
// export * from "./add-functions";
// export * from "./copy-functions";



// const copyFilesToFolder = async (files: Schema$File[], parent: string) => {
//   for (const file of files) {
//     await driveService.files.copy({
//       fileId: file.id!,
//       requestBody: {
//         parents: [parent]
//       }
//     });
//     console.log("Copied file ", file.name);
//   }
// };
//
// const deleteFolder = async (id: string) => {
//   await driveService.files.delete({
//     fileId: id
//   });
//   console.log("Deleted ", id);
// };
// const createSharedDriveFolder = async (name: string, parents?: string[]) => {
//   const requestBody: Schema$File = {
//     mimeType: "application/vnd.google-apps.folder",
//     name
//   };
//   if (parents) {
//     requestBody.parents = parents;
//   }
//
//   const { data: createdFolder } = await driveService.files.create({ requestBody });
//   await driveService.permissions.create({
//     fileId: createdFolder.id!,
//     requestBody: {
//       role: "reader",
//       type: "domain",
//       allowFileDiscovery: false,
//       domain: "oreon.io"
//     }
//   });
//   await driveService.permissions.create({
//     fileId: createdFolder.id!,
//     requestBody: {
//       role: "writer",
//       emailAddress: "robin@oreon.io",
//       type: "user"
//     }
//   });
//   const { data: createdFolderWithUpdates } = await driveService.files.get({
//     fileId: createdFolder.id,
//     fields: ["*"]
//   });
//   console.log("Created folder ", createdFolderWithUpdates.name);
//   console.log("with permissions ", createdFolderWithUpdates.permissions);
// };
//
// const isRC = (file: File) => /-rc\./i.test(file.name);
//
// const addDocumentForFile = async (collection: CollectionReference, file: File) => {
//   const [metadata] = await file.getMetadata();
//   const docId = file.name.slice(file.name.indexOf("/") + 1);
//   const docRef = await collection.doc(docId);
//   const doc = await docRef.get();
//   if (doc.exists) {
//     return false;
//   }
//   docRef.set({
//     quarter: metadata.metadata.quarter,
//     year: metadata.metadata.year,
//     fileName: file.name,
//     rc: isRC(file),
//     timestamp: admin.firestore.FieldValue.serverTimestamp(),
//     gcsUrl: file.metadata.selfLink
//   });
//   return true;
// };
//
