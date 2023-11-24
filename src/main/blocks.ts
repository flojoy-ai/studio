import { BrowserWindow, app, dialog, shell } from "electron";
import * as fs from "fs";
import { join } from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { sendToStatusBar } from "./logging";
import { ncp as cpFolder } from "ncp";

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
  const flojoyDir = join(app.getPath("home"), ".flojoy");
  if (!fs.existsSync(flojoyDir)) {
    fs.mkdirSync(flojoyDir);
  }
  return join(flojoyDir, fileName);
};

export const saveBlocksPack = async ({
  win,
  icon,
  startup,
  update,
}: SaveBlocksPackProps) => {
  if (
    startup &&
    fs.existsSync(getBlocksPathFile()) &&
    fs.existsSync(getBlocksDirPath())
  ) {
    return;
  }
  if (update) {
    const response = dialog.showMessageBoxSync(win, {
      icon,
      message: "Updating will overwrite your local changes.",
      type: "warning",
      detail:
        "Updating will overwrite your local changes, do not forget to commit/push your changes to Github before continuing.",
      buttons: ["Update", "Cancel", "Open blocks folder"],
      defaultId: 1,
    });
    if (response === 1) return;
    if (response === 2) {
      shell.showItemInFolder(getBlocksDirPath());
      return;
    }
    sendToStatusBar("Updating blocks resource pack");
    sendToStatusBar(
      "Update can take few minutes to complete, please do not close the app!",
    );
    try {
      await downloadBlocksRepo(getBlocksDirPath(), win, true);
      return;
    } catch (error) {
      sendToStatusBar(
        "Failed to update blocks resource pack, reason: " + String(error),
      );
      throw Error(
        "Failed to update blocks resource pack, reason: " + String(error),
      );
    }
  }
  const defaultSavePath = getBlocksDirPath();
  try {
    if (startup) {
      await downloadBlocksRepo(defaultSavePath, win);
      return;
    }
    const savePath = getSavePath(win, icon, defaultSavePath ?? "", !startup);
    if (!startup && defaultSavePath === savePath) {
      return;
    }
    await downloadBlocksRepo(savePath, win);
  } catch (error) {
    sendToStatusBar(
      `Failed to download blocks resource, reason: ", ${String(error)}`,
    );
    throw Error("Failed to download blocks resource!");
  }
};

/**
 *
 * Prompts user to choose a location for downloading nodes resource pack
 * @returns location choose by user
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

const downloadBlocksRepo = async (
  downloadPath: string,
  win: BrowserWindow,
  update: boolean = false,
) => {
  if (fs.existsSync(downloadPath) && !update) {
    dialog.showMessageBox(win, {
      message: "Blocks resource pack added successfully!",
      detail: `Blocks resources will be added from ${downloadPath}`,
    });
    savePathToLocalFile(getBlocksPathFile(), downloadPath);
    win.reload();
    return;
  }
  const repoURL = `https://github.com/flojoy-ai/blocks/archive/refs/heads/main.zip`;
  sendToStatusBar("Downloading blocks resource...");
  const res = await axios.get(repoURL, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);
  const zipFilePath = join(app.getPath("temp"), "blocks.zip");
  fs.writeFileSync(zipFilePath, buffer);
  const admZip = new AdmZip(zipFilePath);
  sendToStatusBar(`Extracting resource pack ...`);
  const extractPath = join(app.getPath("temp"), "blocks");
  admZip.extractAllTo(extractPath, true);
  sendToStatusBar(`Copying files to ${downloadPath}...`);
  await Promise.resolve(
    new Promise((resolve, reject) => {
      cpFolder(join(extractPath, "blocks-main"), downloadPath, (err) => {
        if (err) {
          reject(err.map((e) => e.message).join("\n"));
          return;
        }
        resolve(true);
      });
    }),
  );
  savePathToLocalFile(getBlocksPathFile(), downloadPath);
  dialog.showMessageBox(win, {
    message: `Blocks resource pack ${
      update ? "updated" : "downloaded"
    } successfully!`,
    type: "info",
  });
  fs.unlinkSync(zipFilePath);
  win.reload();
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
