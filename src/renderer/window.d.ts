import { writeFileSync as FsWriteFileSync } from "fs";
import api from "../api";

declare global {
  interface Window {
    api: typeof api & {
      isPackaged: boolean;
    };
    electronAPI: {
      writeFileSync: typeof FsWriteFileSync;
    };
  }
}
