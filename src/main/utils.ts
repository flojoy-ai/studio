import * as http from "http";
import * as fs from "fs";
import { isIP } from "net";
import { execCommand } from "./executor";
import { Command } from "./command";
import { app, dialog } from "electron";
import { join } from "path";
import { killCaptain } from "./python";
import log from "electron-log";
import { ChildProcess } from "node:child_process";
import { Result } from "@src/types/result";

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

export const writeFileSync = (_, filePath: string, text: string): void => {
  fs.writeFileSync(filePath, text);
};

export const pickDirectory = async (): Promise<string> => {
  const handler = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return handler.canceled ? "" : handler.filePaths[0];
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

export const openFilePicker = (): Promise<
  { filePath: string; fileContent: string } | undefined
> => {
  return new Promise((resolve, reject) => {
    try {
      const selectedPaths = dialog.showOpenDialogSync(global.mainWindow, {
        properties: ["openFile"],
        filters: [
          {
            extensions: ["json"],
            name: "Json file",
          },
        ],
      });
      if (selectedPaths && selectedPaths?.length > 0) {
        const fileContent = fs.readFileSync(selectedPaths[0], {
          encoding: "utf-8",
        });
        resolve({
          filePath: selectedPaths[0],
          fileContent,
        });
        resolve(undefined);
      }
    } catch (error) {
      reject(String(error));
    }
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

export const saveFileToFullPath = async (
  filePath: string,
  content: string,
): Promise<Result<void>> => {
  fs.writeFileSync(filePath, content);
  return { ok: true, data: undefined };
};
