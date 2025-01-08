import fs from "fs";
import { resolve } from "path";

function exec() {}

async function getMdFilePaths() {
  const path = resolve(__dirname, "../.changeset");
  const files = fs.readdir(path, (err, files) => {
    console.log("fs.readdir", err?.message, files);
  });
}
