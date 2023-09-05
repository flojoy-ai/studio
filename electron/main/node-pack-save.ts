import { BrowserWindow, dialog } from "electron";
import * as fs from "fs";
import { join } from "path";
import { runCmd } from "./cmd";
import { CallBackArgs } from "../api";
import * as os from "os";
type SaveNodePackProps = {
  win: BrowserWindow;
  icon: string;
  starting?: boolean;
  update?: boolean;
};

/**
 *
 * @returns {string} path to txt file where the location of nodes resource pack is saved
 */
const getNodesPathFile = (): string => {
  const fileName = "nodes_path.txt";
  return join(os.homedir(), ".flojoy", fileName);
};

export const saveNodePack = async ({
  win,
  icon,
  starting,
  update,
}: SaveNodePackProps) => {
  return new Promise((resolve) => {
    if (starting && fs.existsSync(getNodesPathFile())) {
      resolve({ success: true });
      return;
    }
    if (update) {
      updateNodesPack(getNodesDirPath(), win);
      resolve({ success: true });
      return;
    }
    const defaultSavePath = getNodesDirPath();
    const savePath = getSavePath(win, icon, defaultSavePath ?? "");
    cloneNodesRepo(savePath, win)
      .then(() => resolve({ success: true }))
      // An error dialog will show up if any error happens in cloneNodesRepo function,
      // calling resolve functions for both case to avoid any breakup in index.ts file
      .catch((err) => resolve(err));
  });
};

/**
 *
 * Propmts user to choose a location for downloading nodes resource pack
 * @returns location choosed by user
 */
const getSavePath = (
  win: BrowserWindow,
  icon: string,
  savePath: string,
): string => {
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

const cloneNodesRepo = (clonePath: string, win: BrowserWindow) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(clonePath)) {
      dialog.showMessageBox(win, {
        message: "Nodes resource added successfully!",
        detail: `Nodes resource will be added from ${clonePath}`,
      });
      savePathToLocalFile(getNodesPathFile(), clonePath);
      resolve({ success: true });
      return;
    }
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
    ).catch(({ code, lastOutput }) => {
      if (code > 0) {
        sendLogToStudio(title, description)(win, {
          open: true,
          output:
            "Error :: Failed to download nodes resource pack, see error printed above!",
        });
        dialog.showErrorBox(
          "Failed to download nodes resource pack!",
          lastOutput,
        );
        reject(new Error(lastOutput));
      } else {
        sendLogToStudio(title, description)(win, { open: false, output: "" });
        dialog.showMessageBox(win, {
          message: "Nodes resource pack downloaded successfully!",
          type: "info",
        });
        savePathToLocalFile(getNodesPathFile(), clonePath);
        resolve({ success: true });
      }
    });
  });
};
/**
 *
 * @returns {string} path to nodes resource pack if resource is downloaded already
 * else a default path where resource pack can be downloaded ideally os Download directory
 */
const getNodesDirPath = (): string => {
  if (fs.existsSync(getNodesPathFile())) {
    return fs.readFileSync(getNodesPathFile(), { encoding: "utf-8" });
  }
  return join(os.homedir(), "Downloads", "nodes");
};

const sendLogToStudio =
  (title: string, description: string) =>
  (win: BrowserWindow, data: CallBackArgs) => {
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

const updateNodesPack = (nodesPath: string, win: BrowserWindow) => {
  const updateCmd =
    process.platform === "win32"
      ? `pwsh -Command "Set-Location ${nodesPath} && git pull`
      : `cd "${nodesPath}" && git pull`;
  const title = "Updating Nodes resource pack";
  const description =
    "Update can take few minutes to complete, please do not close the app!";
  sendLogToStudio(title, description)(win, {
    open: true,
    clear: true,
    output: "",
  });
  sendLogToStudio(title, description)(win, `Running command: ${updateCmd}`);
  runCmd(
    updateCmd,
    undefined,
    win,
    "Nodes-pack-update",
    sendLogToStudio(title, description),
  ).catch(({ code, lastOutput }) => {
    if (code > 0) {
      dialog.showErrorBox("Failed to update nodes pack", lastOutput);
    } else {
      sendLogToStudio(title, description)(win, {
        open: false,
        output: "Updating complete!",
      });
      dialog.showMessageBox(win, {
        message: "Update successfull",
        detail: "Updated nodes resource pack successfully to " + nodesPath,
      });
      win.reload();
    }
  });
};
