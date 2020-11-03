import morgan from "morgan";
import fs from "fs";
import os from "os";
import Busboy from "busboy";
import path from "path";
import { inDevelopment } from "./config";
import type { RequestHandler, Router } from "express";

export interface UploadedFiles {
  [index: string]: {
    filename: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  }
}

// Taken from https://gist.github.com/msukmanowsky/c8daf3720c2839d3c535afc69234ab9e
const filesUpload: RequestHandler = (req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    const busboy = new Busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    });

    const fields: { [key: string]: string } = {};
    const files: UploadedFiles = {};
    const fileWrites: Promise<void>[] = [];

    const tmpdir = os.tmpdir();

    busboy.on("field", (key, value) => {
      fields[key] = value;
    });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(tmpdir, filename);
      console.log(`Handling file upload field ${fieldname}: ${filename} (${filepath})`);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      fileWrites.push(new Promise((resolve, reject) => {
        file.on("end", () => writeStream.end());
        writeStream.on("finish", () => {
          fs.readFile(filepath, (err, buffer) => {
            if (err) {
              return reject(err);
            }
            const size = Buffer.byteLength(buffer);
            files[fieldname] = {
              filename,
              encoding,
              mimetype,
              buffer,
              size
            };
            try {
              fs.unlinkSync(filepath);
            } catch (err) {
              return reject(err);
            }
            resolve();
          });
        });
      }));
    });

    busboy.on("finish", async () => {
      try {
        await Promise.all(fileWrites);
        req.body = fields;
        req.files = files;
        next();
      } catch (e) {
        next(e);
      }
    });

    busboy.end(req.rawBody);
  } else {
    next();
  }
};

export const configureMiddleware = (router: Router): void => {
  // TODO: This doesn't seem to be working?
  router.use(morgan(inDevelopment() ? "dev" : "tiny"));
  router.use(filesUpload);
};
