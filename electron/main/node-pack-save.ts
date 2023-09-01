import { dialog } from "electron";
import * as fs from "fs";
import { join } from "path";
import { runCmd } from "./cmd";
import { CallBackArgs } from "../api";

const getNodesPathFile = () => {
  const fileName = "nodes_path.txt";
  if (process.platform === "win32") {
    return join(process.env.APPDATA ?? "", ".flojoy", fileName);
  }
  return join(process.env.HOME ?? "", ".flojoy", fileName);
};

export const saveNodePack = (
  win: Electron.BrowserWindow,
  icon: string,
  update?: boolean,
) => {
  if (!update && fs.existsSync(getNodesPathFile())) {
    return;
  }
  const defaultSavePath = getNodesDirPath();
  const savePath = getSavePath(win, icon, defaultSavePath ?? "");
  cloneNodesRepo(savePath, win);
};

const getSavePath = (
  win: Electron.BrowserWindow,
  icon: string,
  savePath: string,
) => {
  const res = dialog.showMessageBoxSync(win, {
    type: "info",
    title: ":::: Download node resource pack",
    message: "Studio requires node resource pack to function correctly!",
    detail: `Node resource pack will be downloaded to following location: \n\n ${savePath?.replace(
      /\\/g,
      "/",
    )}`,
    buttons: ["Change", "Continue"],
    icon,
    defaultId: 1,
    cancelId: 1,
  });
  if (res == 0) {
    const selectedPaths = dialog.showOpenDialogSync(win, {
      buttonLabel: "Change",
      properties: ["openDirectory"],
    });

    if (selectedPaths?.length) {
      const path = selectedPaths[0];
      return getSavePath(win, icon, join(path, "nodes"));
    }
    return getSavePath(win, icon, savePath);
  } else {
    return savePath;
  }
};

const savePathToLocalFile = (fileName: string, path: string) => {
  fs.writeFileSync(fileName, path);
};

const cloneNodesRepo = (clonePath: string, win: Electron.BrowserWindow) => {

  const cloneCmd = `git clone https://github.com/flojoy-ai/nodes.git ${clonePath}`;
  const title = "Downloading Nodes resuorce pack!";
  const description = `Downloading nodes resource pack to ${clonePath}...`;
  sendLogToStudio(title, description)(win, {
    open: true,
    output: description,
    clear: true,
  });
  runCmd(
    cloneCmd,
    undefined,
    win,
    "Nodes-resource",
    sendLogToStudio(title, description),
  ).catch(({ code }) => {
    if (code > 0) {
      sendLogToStudio(title, description)(win, {
        open: true,
        output:
          "Error :: Failed to download nodes resource pack, see error printed above!",
      });
    } else {
      sendLogToStudio(title, description)(win, { open: false, output: "" });
      dialog.showMessageBox(win, {
        message: "Nodes resource pack downloaded successfully!",
        type: "info",
      });
      savePathToLocalFile(getNodesPathFile(), clonePath);
    }
  });
};

const getNodesDirPath = () => {
  if (fs.existsSync(getNodesPathFile())) {
    return fs.readFileSync(getNodesPathFile(), { encoding: "utf-8" });
  }
  return join(process.env.HOME ?? "", "Downloads", "nodes");
};

const sendLogToStudio =
  (title: string, description: string) =>
  (win: Electron.BrowserWindow, data: CallBackArgs) => {
    win.webContents.send(
      "backend",
      typeof data === "string"
        ? {
            open: true,
            title,
            description,
            output: data,
          }
        : { ...data, title, description },
    );
  };
