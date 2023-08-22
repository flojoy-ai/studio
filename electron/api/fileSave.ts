import { writeFileSync } from "fs";
import { ipcRenderer } from "electron";

export function saveFile(path: string, data: string) {
  writeFileSync(path, data);
}

export async function saveFileAs(
  data: string,
): Promise<Electron.SaveDialogReturnValue> {
  const result = await ipcRenderer.invoke("show-save-as-dialog");
  if (result.path) {
    saveFile(result.path, data);
  }
  return result;
}
