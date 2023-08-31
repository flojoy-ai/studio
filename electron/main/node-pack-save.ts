import { dialog } from "electron";
import * as fs from "fs";
import path, { join } from "path";
import { runCmd } from "./cmd";
import { CallBackArgs } from "../api";

const NODE_DIR_PATH = join(__dirname, "node_path.txt");

export const saveNodePack = (
  win: Electron.BrowserWindow,
  icon: string,
  update?: boolean,
) => {
  if (!update && fs.existsSync(NODE_DIR_PATH)) {
    return;
  }
  const defaultSavePath = getNodesDirPath();
  const savePath = getSavePath(win, icon, defaultSavePath ?? "");
  console.log(" save path: ", savePath);
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
      return getSavePath(win, icon, path);
    }
    return getSavePath(win, icon, savePath);
  } else {
    return savePath;
  }
};

const savePathToLocalFile = (fileName: string, path: string) => {
  fs.writeFileSync(fileName, path);
};

const cloneNodesRepo = (location: string, win: Electron.BrowserWindow) => {
  let clonePath = location;
  // Check if path exists
  if (fs.existsSync(location)) {
    // Check if directory is empty
    if (fs.readdirSync(location).length > 0) {
      clonePath = path.join(location, "nodes");
    }
  }
  const cloneCmd = `git clone https://github.com/flojoy-ai/nodes.git ${clonePath}`;
  const title = "Downloading Nodes resuorce pack!";
  const description = `Downloading nodes resource pack to ${clonePath}...`;
  win.webContents.send("backend", {
    open: true,
    title,
    output: description,
    clear: true,
  });
  runCmd(cloneCmd, undefined, win, sendLogToStudio).catch(({ code }) => {
    if (code > 0) {
      win.webContents.send("backend", {
        open: true,
        output:
          "Error :: Failed to download nodes resource pack, see error printed above!",
      });
    } else {
      win.webContents.send("backend",{open:false,output:""})
      dialog.showMessageBox(win, {
        message: "Nodes resource pack downloaded successfully!",
        type:"info"
      });
      savePathToLocalFile(NODE_DIR_PATH, clonePath);
    }
  });
};

const getNodesDirPath = () => {
  if (fs.existsSync(NODE_DIR_PATH)) {
    return fs.readFileSync(NODE_DIR_PATH, { encoding: "utf-8" });
  }
  return process.platform === "win32"
    ? join(process.env.HOME ?? "", "Downloads")
    : process.env.HOME;
};

const sendLogToStudio = (win: Electron.BrowserWindow, data: CallBackArgs) => {
  win.webContents.send("backend", {
    open: true,
    title: "Downloading Nodes resuorce pack!",
    output: data,
  });
};
