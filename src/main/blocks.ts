import { BrowserWindow, app, dialog } from "electron";
import * as fs from "fs";
import { join } from "path";
import { Command } from "./command";
import * as os from "os";
import { execSync } from "child_process";
import { execCommand } from "./executor";
import log from "electron-log/main";
type SaveBlocksPackProps = {
  win: BrowserWindow;
  icon: string;
  startup?: boolean;
  update?: boolean;
};

/**
 *
 * @returns {string} path to txt file where the location of nodes resource pack is saved
 */
const getBlocksPathFile = (): string => {
  const fileName = "blocks_path.txt";
  return join(os.homedir(), ".flojoy", fileName);
};

export const saveBlocksPack = async ({
  win,
  icon,
  startup,
  update,
}: SaveBlocksPackProps) => {
  return new Promise((resolve) => {
    if (
      startup &&
      fs.existsSync(getBlocksPathFile()) &&
      fs.existsSync(getBlocksDirPath())
    ) {
      resolve({ success: true });
      return;
    }
    if (update) {
      updateBlocksPack(getBlocksDirPath(), win, icon);
      resolve({ success: true });
      return;
    }
    const defaultSavePath = getBlocksDirPath();
    const savePath = getSavePath(win, icon, defaultSavePath ?? "", !startup);
    if (!startup && defaultSavePath === savePath) {
      resolve({ success: true });
      return;
    }
    cloneBlocksRepo(savePath, win)
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
    ? "Choose location for downloading blocks resource pack"
    : "Studio requires blocks resource pack to function correctly!";
  const res = dialog.showMessageBoxSync(win, {
    type: "info",
    title: "Download blocks resource pack",
    message,
    detail: `Blocks resource pack will be downloaded to following location: \n\n ${savePath?.replace(
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
      return getSavePath(win, icon, join(path, "blocks"), update);
    }
    return getSavePath(win, icon, savePath, update);
  } else {
    return savePath;
  }
};

const savePathToLocalFile = (fileName: string, path: string) => {
  fs.writeFileSync(fileName, path);
};

const cloneBlocksRepo = (clonePath: string, win: BrowserWindow) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(clonePath)) {
      dialog.showMessageBox(win, {
        message: "Blocks resource pack added successfully!",
        detail: `Blocks resources will be added from ${clonePath}`,
      });
      savePathToLocalFile(getBlocksPathFile(), clonePath);
      win.reload();
      resolve({ success: true });
      return;
    }
    const cloneCmd = `git clone https://github.com/flojoy-ai/blocks.git ${clonePath}`;
    execCommand(new Command(cloneCmd))
      .then(() => {
        dialog.showMessageBox(win, {
          message: "Blocks resource pack downloaded successfully!",
          type: "info",
        });
        savePathToLocalFile(getBlocksPathFile(), clonePath);
        win.reload();
        resolve({ success: true });
      })
      .catch((reason) => {
        dialog.showErrorBox("Failed to download blocks resource pack!", reason);
        reject(new Error(reason));
      });
  });
};
/**
 *
 * @returns {string} path to nodes resource pack if resource is downloaded already
 * else a default path where resource pack can be downloaded ideally os Download directory
 */
const getBlocksDirPath = (): string => {
  if (fs.existsSync(getBlocksPathFile())) {
    return fs.readFileSync(getBlocksPathFile(), { encoding: "utf-8" });
  }
  if (!app.isPackaged) {
    return join(process.cwd(), "PYTHON", "blocks");
  }
  return join(app.getPath("downloads"), "blocks");
};

const updateBlocksPack = (
  blocksPath: string,
  win: BrowserWindow,
  icon: string,
) => {
  const title = "Updating blocks resource pack";
  const description =
    "Update can take few minutes to complete, please do not close the app!";
  log.info(title);
  log.info(description);
  // Store the current working directory
  const currentDirectory = process.cwd();
  if (!fs.existsSync(blocksPath)) {
    log.error(
      `Error - Blocks directory is not found at ${blocksPath}.. downloading blocks resource pack..`,
    );
    saveBlocksPack({
      win,
      startup: true,
      icon,
    });
    return;
  }
  try {
    process.chdir(blocksPath);
    // Check if there are any local changes
    const statusOutput = execSync("git status --porcelain").toString();
    if (statusOutput.trim().length > 0) {
      // There are local changes
      log.info("Found local changes, creating a zip archive...");
      // Create a timestamp for the zip folder
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");

      // Create a zip file with existing files
      const zipFileName = `local_changes_${timestamp}.zip`;
      execSync(`git archive -o ${zipFileName} HEAD`);
      log.info(`Created zip file: ${zipFileName} ...`);
      // Create a new folder for the zip file and move it there
      const zipFolder = join(blocksPath, ".local-changes");
      fs.mkdirSync(zipFolder, { recursive: true });

      log.info(`Copying ${zipFileName} file to ${zipFolder}...`);
      const zipFilePath = join(zipFolder, zipFileName);
      fs.renameSync(zipFileName, zipFilePath);

      // Stash local changes
      execSync("git stash");
      // Run git pull
      execSync("git pull");
      log.info("Updated blocks resource pack successfully!");
    } else {
      log.info("Updating blocks resource pack... hang tight..");
      // There are no local changes, simply run git pull
      const pullResult = execSync("git pull").toString();
      log.info(pullResult);
      log.info("Updated blocks resource pack successfully!");
    }
    win.reload();
    // Restore the original working directory
    process.chdir(currentDirectory);
  } catch (error) {
    dialog.showErrorBox("Failed to update blocks pack", String(error));
    process.chdir(currentDirectory);
  }
};
