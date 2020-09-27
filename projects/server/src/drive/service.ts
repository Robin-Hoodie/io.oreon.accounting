import { google } from "googleapis";
import credentials from "../config/service-account-drive.json";

const scopes = [
  "https://www.googleapis.com/auth/drive.file"
];

const auth = new google.auth.JWT(credentials.client_email,
  undefined,
  credentials.private_key,
  scopes);

export default google.drive({ version: "v3", auth });
