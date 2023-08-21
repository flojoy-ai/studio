import { writeFileSync } from "fs";
import { ipcRenderer } from "electron";

export function saveFile(path: string, data: string) {
  writeFileSync(path, data);
}

export async function saveFileAs(data: string): Promise<string | undefined> {
  const path = await ipcRenderer.invoke("show-save-as-dialog");
  if (path) {
    saveFile(path, data);
    return path;
  }
}
