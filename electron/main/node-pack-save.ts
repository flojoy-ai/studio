import { BrowserWindow, dialog } from "electron";
import * as fs from "fs";
import { join } from "path";
import { runCmd } from "./cmd";
import { CallBackArgs } from "../api";
import * as os from "os";
import { execSync } from "child_process";
type SaveNodePackProps = {
  win: BrowserWindow;
  icon: string;
  startup?: boolean;
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
  startup,
  update,
}: SaveNodePackProps) => {
  return new Promise((resolve) => {
    if (
      startup &&
      fs.existsSync(getNodesPathFile()) &&
      fs.existsSync(getNodesDirPath())
    ) {
      resolve({ success: true });
      return;
    }
    if (update) {
      updateNodesPack(getNodesDirPath(), win, icon);
      resolve({ success: true });
      return;
    }
    const defaultSavePath = getNodesDirPath();
    const savePath = getSavePath(win, icon, defaultSavePath ?? "", !startup);
    if (!startup && defaultSavePath === savePath) {
      resolve({ success: true });
      return;
    }
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
  update: boolean | undefined,
): string => {
  const message = update
    ? "Choose location for downloading nodes resource pack"
    : "Studio requires node resource pack to function correctly!";
  const res = dialog.showMessageBoxSync(win, {
    type: "info",
    title: "Download node resource pack",
    message,
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
      return getSavePath(win, icon, join(path, "nodes"), update);
    }
    return getSavePath(win, icon, savePath, update);
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
      win.reload();
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
    runCmd({
      command: cloneCmd,
      broadcast: { win, cb: sendLogToStudio(title, description) },
      serviceName: "Nodes-resource",
    }).catch(({ code, lastOutput }) => {
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
        win.reload();
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
      "electron-log",
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

const updateNodesPack = (
  nodesPath: string,
  win: BrowserWindow,
  icon: string,
) => {
  const title = "Updating Nodes resource pack";
  const description =
    "Update can take few minutes to complete, please do not close the app!";
  sendLogToStudio(title, description)(win, {
    open: true,
    clear: true,
    output: description,
  });
  // Store the current working directory
  const currentDirectory = process.cwd();
  if (!fs.existsSync(nodesPath)) {
    sendLogToStudio(title, description)(
      win,
      `Error - Nodes directory is not found at ${nodesPath}.. downloading nodes resource pack..`,
    );
    saveNodePack({
      win,
      startup: true,
      icon,
    });
    return;
  }
  try {
    process.chdir(nodesPath);
    // Check if there are any local changes
    const statusOutput = execSync("git status --porcelain").toString();
    if (statusOutput.trim().length > 0) {
      // There are local changes
      sendLogToStudio(title, description)(
        win,
        "Found local changes, creating a zip archive...",
      );
      // Create a timestamp for the zip folder
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");

      // Create a zip file with existing files
      const zipFileName = `local_changes_${timestamp}.zip`;
      execSync(`git archive -o ${zipFileName} HEAD`);
      sendLogToStudio(title, description)(
        win,
        `Created zip file: ${zipFileName} ...`,
      );
      // Create a new folder for the zip file and move it there
      const zipFolder = join(nodesPath, ".local-changes");
      fs.mkdirSync(zipFolder, { recursive: true });

      sendLogToStudio(title, description)(
        win,
        `Copying ${zipFileName} file to ${zipFolder}...`,
      );
      const zipFilePath = join(zipFolder, zipFileName);
      fs.renameSync(zipFileName, zipFilePath);

      // Stash local changes
      execSync("git stash");
      // Run git pull
      execSync("git pull");
      sendLogToStudio(title, description)(
        win,
        "Updated nodes resource pack successfully!",
      );
    } else {
      sendLogToStudio(title, description)(
        win,
        "Updating nodes resource pack... hang tight..",
      );
      // There are no local changes, simply run git pull
      const pullResult = execSync("git pull").toString();
      sendLogToStudio(title, description)(win, pullResult);
      sendLogToStudio(title, description)(
        win,
        "Updated nodes resource pack successfully!",
      );
    }
    win.reload();
    // Restore the original working directory
    process.chdir(currentDirectory);
  } catch (error) {
    dialog.showErrorBox("Failed to update nodes pack", error?.message);
    process.chdir(currentDirectory);
  }
};
