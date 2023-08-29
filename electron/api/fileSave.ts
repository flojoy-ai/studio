import { writeFileSync } from "fs";
import { ipcRenderer } from "electron";

export function saveFile(path: string, data: string) {
  writeFileSync(path, data);
}

export async function saveFileAs(
  defaultFilename: string,
  data: string,
): Promise<Electron.SaveDialogReturnValue> {
  const result = await ipcRenderer.invoke(
    "show-save-as-dialog",
    defaultFilename,
  );
  if (result.filePath) {
    saveFile(result.filePath, data);
  }
  return result;
}
