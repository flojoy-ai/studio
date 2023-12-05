import { execSync } from "child_process";
import { join } from "path";
import fs from "fs";
import { ElectronApplication } from "playwright";
export const STARTUP_TIMEOUT = 900000; // 15 mins
export const standbyStatus = "🐢 awaiting a new job";
export const getExecutablePath = () => {
  switch (process.platform) {
    case "darwin":
      return join(
        process.cwd(),
        "dist/mac-universal/Flojoy Studio.app/Contents/MacOS/Flojoy Studio",
      );
    case "win32": {
      const arch = process.arch;
      const folderName =
        arch === "arm64" ? `win-${arch}-unpacked` : "win-unpacked";
      return join(process.cwd(), `dist/${folderName}/Flojoy Studio.exe`);
    }
    case "linux": {
      const arch = process.arch;
      const folderName = `linux-${arch === "arm64" ? `${arch}-` : ""}unpacked`;
      const appPath = join(process.cwd(), `dist/${folderName}/flojoy-studio`);
      execSync(`chmod +x "${appPath}"`);
      return appPath;
    }
    default:
      throw new Error("Unrecognized platform: " + process.platform);
  }
};

export const writeLogFile = async (
  app: ElectronApplication,
  testName: string,
) => {
  const logPath = await app.evaluate(async ({ app: _app }) => {
    return _app.getPath("logs");
  });
  const logFile = join(logPath, "main.log");
  const logs = fs.readFileSync(logFile);
  fs.writeFileSync(
    `test-results/${process.platform}-${testName}-logs.txt`,
    logs,
  );
};

export const killBackend = async () => {
  let cmd: string;
  switch (process.platform) {
    case "win32":
      cmd = `FOR /F "tokens=5" %i IN ('netstat -aon ^| find "5392"') DO Taskkill /F /PID %i`;
      break;
    case "darwin":
    case "linux":
      cmd = `kill -9 $(lsof -t -i :5392)`;
      break;
    default:
      cmd = "";
      break;
  }
  try {
    execSync(cmd);
  } catch (error) {
    //
  }
};

export const mockDialogMessage = async (app: ElectronApplication) => {
  await app.evaluate(async ({ dialog }) => {
    const originalShowMessageBoxSync = dialog.showMessageBoxSync;

    // Create a wrapper function with the original signature
    const wrapperShowMessageBoxSync = (
      browserWindow: Electron.BrowserWindow | undefined,
      options: Electron.MessageBoxSyncOptions,
    ) => {
      if (options.title === "Existing Server Detected") {
        return 1;
      } else {
        return browserWindow
          ? originalShowMessageBoxSync(browserWindow, options)
          : originalShowMessageBoxSync(options);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dialog.showMessageBoxSync = wrapperShowMessageBoxSync as any;
  });
};
