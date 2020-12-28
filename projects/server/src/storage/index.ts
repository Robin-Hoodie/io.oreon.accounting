import * as admin from "firebase-admin";
import type { Bucket } from "@google-cloud/storage";
import type { Quarter } from "../types";

type Company = "OREON_IT_CONSULTING" | "OREON";
type Folder = "INVOICES_INCOMING" | "INVOICES_OUTGOING";

export class CloudStorage {
  bucket: Bucket;

  constructor (private company: Company, private folder: Folder) {
    this.bucket = admin.storage().bucket();
  }

  get signedUrlExpiration () {
    return Date.now() + 60 * 10000;
  }

  fullFilename (year: string, quarter: Quarter, filename: string): string {
    return `${this.company}/${this.folder}/${year}/${quarter}/${filename}`;
  }

  async getSignedUrl (year: string, quarter: Quarter, filename: string): Promise<string> {
    const signedUrlResponse = await this.bucket.file(this.fullFilename(year, quarter, filename))
      .getSignedUrl({
        action: "write",
        expires: this.signedUrlExpiration,
        contentType: "application/pdf",
        version: "v4",
        virtualHostedStyle: true
      });
    return signedUrlResponse[0];
  }
}
