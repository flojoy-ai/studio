import { ipcRenderer } from "electron";
import { API } from ".";

export function saveFile(
  path: string,
  data: string,
  allowedExtensions: string[] = ["json"],
) {
  ipcRenderer.send(API.writeFileSync, path, data, allowedExtensions);
}

export async function saveToFile(path: string, data: string): Promise<boolean> {
  try {
    saveFile(path, data, ["tjoy"]);
    return true;
  } catch {
    return false;
  }
}

export async function saveFileAs(
  defaultFilename: string,
  data: string,
  allowedExtensions: string[] = ["json"],
): Promise<Electron.SaveDialogReturnValue> {
  const result = await ipcRenderer.invoke(
    API.showSaveDialog,
    defaultFilename,
    allowedExtensions,
  );
  if (result.filePath) {
    saveFile(result.filePath, data);
  }
  return result;
}
