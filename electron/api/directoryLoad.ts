import { ipcRenderer } from "electron";

export async function openDirectory(): Promise<Electron.OpenDialogReturnValue> {
  const result = await ipcRenderer.invoke("show-open-directory-dialog");
  return result;
}