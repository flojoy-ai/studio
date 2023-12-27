import { app } from "electron";
import { join } from "node:path";

export const WORKING_DIR = join(__dirname, "../../");
export const DIST_ELECTRON = join(WORKING_DIR, "out");
export const PUBLIC_DIR = join(
  WORKING_DIR,
  app.isPackaged ? "../public" : "public",
);
