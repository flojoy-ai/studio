import { ipcRenderer } from "electron";
import { API } from "../types/api";

export function saveFile(path: string, data: string) {
  ipcRenderer.send(API.writeFileSync, path, data);
}

export async function saveFileAs(
  defaultFilename: string,
  data: string,
): Promise<Electron.SaveDialogReturnValue> {
  const result = await ipcRenderer.invoke(API.showSaveDialog, defaultFilename);
  if (result.filePath) {
    saveFile(result.filePath, data);
  }
  return result;
}
