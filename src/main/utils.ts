import * as http from "http";
import * as fs from "fs";
import { isIP } from "net";
import { execCommand } from "./executor";
import { Command } from "./command";
import { app, dialog } from "electron";
import { join, posix, sep } from "path";
import { killCaptain } from "./python";
import log from "electron-log";
import { ChildProcess } from "node:child_process";

export const isPortFree = (port: number) =>
  new Promise((resolve) => {
    const server = http
      .createServer()
      .listen(port, "127.0.0.1", () => {
        server.close();
        resolve(true);
      })
      .on("error", () => {
        resolve(false);
      });
  });

export const killProcess = async (port: number) => {
  await execCommand(
    new Command({
      darwin: `kill -9 $(lsof -t -i :${port})`,
      linux: `kill -9 $(lsof -t -i :${port})`,
      win32: `FOR /F "tokens=5" %i IN ('netstat -aon ^| find "${port}"') DO Taskkill /F /PID %i`,
    }),
  );
};

export const ping = async (addr: string) => {
  if (isIP(addr) === 0) {
    throw new Error(`Invalid IP address: ${addr}`);
  }

  return await execCommand(
    new Command({
      win32: `ping -n 1 ${addr}`,
      darwin: `ping -c 1 ${addr}`,
      linux: `ping -c 1 ${addr}`,
    }),
    { quiet: true },
  );
};

export const netstat = async () => {
  return await execCommand(
    new Command({
      win32: "netstat",
      darwin: "netstat",
      linux: "netstat",
    }),
    { quiet: true },
  );
};

export const ifconfig = async () => {
  return await execCommand(
    new Command({
      win32: "ipconfig /all",
      darwin: "ifconfig",
      linux: "ifconfig",
    }),
    { quiet: true },
  );
};

export const writeFileSync = (_, filePath: string, text: string): boolean => {
  try {
    fs.writeFileSync(filePath, text);
    return true
  } catch (error) {
    log.error("Something went wrong when writing to file", error);
    return false;
  }
};

export const pickDirectory = async (
  _,
  allowDirectoryCreation: boolean = false,
): Promise<string> => {
  let handler: Electron.OpenDialogReturnValue;
  if (allowDirectoryCreation) {
    handler = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
    });
  } else {
    handler = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
  }

  return handler.canceled
    ? ""
    : handler.filePaths[0].split(sep).join(posix.sep);
};

export const getCustomBlocksDir = async () => {
  const filePath = join(app.getPath("home"), ".flojoy/custom_blocks_path.txt");

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const blocksPath = fs
    .readFileSync(filePath, { encoding: "utf-8" })
    .toString();

  if (!fs.existsSync(blocksPath)) {
    return undefined;
  }

  return blocksPath;
};

export const cacheCustomBlocksDir = (_, dirPath: string) => {
  const flojoyDir = join(app.getPath("home"), ".flojoy");
  if (!fs.existsSync(flojoyDir)) {
    fs.mkdirSync(flojoyDir);
  }
  const cacheFilePath = join(flojoyDir, "custom_blocks_path.txt");
  fs.writeFileSync(cacheFilePath, dirPath);
};

export const openFilePicker = (
  _,
  name: string = "File",
  allowedExtensions: string[] = ["json"],
): Promise<{ filePath: string; fileContent: string } | undefined> => {
  return dialog
    .showOpenDialog(global.mainWindow, {
      properties: ["openFile"],
      filters: [
        {
          extensions: allowedExtensions,
          name,
        },
      ],
    })
    .then((selectedPaths) => {
      if (selectedPaths.filePaths.length > 0) {
        const fileContent = fs.readFileSync(selectedPaths.filePaths[0], {
          encoding: "utf-8",
        });
        return {
          filePath: selectedPaths.filePaths[0].split(sep).join(posix.sep),
          fileContent,
        };
      }
      return undefined;
    });
};

export const openFilesPicker = (
  _,
  allowedExtensions: string[] = ["json"],
  title: string = "Select Files",
): Promise<{ filePath: string; fileContent: string }[] | undefined> => {
  // Return mutiple files or all file with the allowed extensions if a folder is selected
  return dialog
    .showOpenDialog(global.mainWindow, {
      title: title,
      properties: ["openFile", "multiSelections"],
      filters: [
        {
          extensions: allowedExtensions,
          name: "File",
        },
      ],
    })
    .then((selectedPaths) => {
      if (selectedPaths.filePaths.length > 0) {
        const files = selectedPaths.filePaths.map((path) => {
          return {
            filePath: path.split(sep).join(posix.sep),
            fileContent: fs.readFileSync(path, { encoding: "utf-8" }),
          };
        });
        return files;
      }
      return undefined;
    });
};

export const openAllFilesInFolderPicker = (
  _,
  allowedExtensions: string[] = ["json"],
  title: string = "Select Folder",
): Promise<{ filePath: string; fileContent: string }[] | undefined> => {
  // Return mutiple files or all file with the allowed extensions if a folder is selected
  return dialog
    .showOpenDialog(global.mainWindow, {
      title: title,
      properties: ["openDirectory"],
    })
    .then((selectedPaths) => {
      if (
        selectedPaths.filePaths.length === 1 &&
        fs.lstatSync(selectedPaths.filePaths[0]).isDirectory()
      ) {
        // If a folder is selected, found all file with the allowed extensions from that folder
        const folerPath = selectedPaths.filePaths[0];
        const paths: string[] = [];
        fs.readdirSync(folerPath, { withFileTypes: true }).forEach((dirent) => {
          if (dirent.isFile()) {
            const nameAndExt = dirent.name.split(".");
            const ext = nameAndExt[nameAndExt.length - 1];
            if (allowedExtensions.includes(ext)) {
              paths.push(join(folerPath, dirent.name));
            }
          }
        });
        const files = paths.map((path) => {
          return {
            filePath: path.split(sep).join(posix.sep),
            fileContent: fs.readFileSync(path, { encoding: "utf-8" }),
          };
        });
        return files;
      }
      return undefined;
    });
};

export const cleanup = async () => {
  const captainProcess = global.captainProcess as ChildProcess;
  log.info(
    "Cleanup function invoked, is captain running? ",
    !(captainProcess?.killed ?? true),
  );
  if (captainProcess && captainProcess.exitCode === null) {
    const success = killCaptain();
    if (success) {
      global.captainProcess = null;
      log.info("Successfully terminated captain :)");
    } else {
      log.error("Something went wrong when terminating captain!");
    }
  }
};

export const loadFileFromFullPath = async (
  filePath: string,
): Promise<string> => {
  return fs.readFileSync(filePath, { encoding: "utf-8" }).toString();
};

export const saveFileToFullPath = fs.writeFileSync;
export const readFileSync = (_, filePath: string) => {
  return fs.readFileSync(filePath, { encoding: "utf-8" });
};

export const isFileOnDisk = (_, filePath: string): Promise<boolean> => {
  return Promise.resolve(fs.existsSync(filePath));
};
