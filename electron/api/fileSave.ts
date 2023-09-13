import { ipcRenderer } from "electron";

export function saveFile(path: string, data: string) {
  ipcRenderer.send("write-file-sync", path, data);
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
