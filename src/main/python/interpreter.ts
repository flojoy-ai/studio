import { readdir, stat } from "fs";
import { join } from "path";
import os from "os";
import { execCommand } from "../executor";
import { Command } from "../command";
import { dialog } from "electron";
export type InterpretersList = {
  path: string;
  default: false;
  version: {
    major: number;
    minor: number;
  };
}[];
class PythonManager {
  defaultBinPaths = {
    darwin: [
      "/usr/bin", // Add more paths as needed
      "/usr/local/bin",
      "/opt/local/bin", // For macOS with MacPorts
      os.homedir() + "/miniconda3/bin",
    ],
    win32: [os.homedir() + "/miniconda3"],
  };
  executables: string[] = [];

  constructor() {}

  gatherPathsFromDefaultBin() {
    const promises: Array<Promise<void>> = [];

    const checkDirectory = (dirPath: string) => {
      promises.push(
        new Promise<void>((resolve) => {
          readdir(dirPath, (err, files) => {
            if (err) {
              resolve();
              return;
            }

            const filePromises = files.map((file) => {
              const filePath = join(dirPath, file);

              return new Promise<void>((resolveFile) => {
                stat(filePath, (err, stats) => {
                  if (
                    !err &&
                    stats.isFile() &&
                    filePath.toLowerCase().includes("python")
                  ) {
                    if (PythonManager.isPythonFile(file)) {
                      this.executables.push(filePath);
                    }
                  }
                  resolveFile();
                });
              });
            });

            Promise.all(filePromises).then(() => {
              resolve();
            });
          });
        }),
      );
    };

    // Check each directory in pythonDirPaths
    this.defaultBinPaths[process.platform].forEach(checkDirectory);

    return Promise.all(promises);
  }

  async getCondaEnvs() {
    const cmd = "conda info --json";
    try {
      const condaInfo = await execCommand(
        new Command({ darwin: cmd, linux: cmd, win32: cmd }),
      );
      const parseInfo = JSON.parse(condaInfo);

      const envPaths = parseInfo.envs.map((env) => {
        if (process.platform === "win32") {
          return join(env, "python.exe");
        }
        return join(env, "bin", "python");
      });
      return envPaths as string[];
    } catch (error) {
      return null;
    }
  }

  async getGlobalPython() {
    try {
      const cmd = `python -c "import sys; print(sys.executable)"`;
      const defaultPythonPath = await execCommand(
        new Command({
          darwin: cmd,
          linux: cmd,
          win32: cmd,
        }),
      );
      return defaultPythonPath.trim();
    } catch (err) {
      return null;
    }
  }

  static isPythonFile(fileName: string) {
    let isPython = true;
    const splitByHyphen = fileName.split("-");
    if (splitByHyphen.length > 1) {
      isPython = false;
    } else {
      fileName
        .split(".")[0]
        .split("python")
        .forEach((p) => {
          if (isNaN(+p)) {
            isPython = false;
          }
        });
    }
    const splitByDot = fileName.split(".");

    if (splitByDot.length > 1) {
      splitByDot.slice(1).forEach((p) => {
        if (isNaN(+p)) {
          isPython = false;
        }
      });
    }
    return isPython;
  }

  static async checkVersion(
    interpreter: string,
    version: { major: number; minor: number },
  ) {
    const cmd = `${interpreter} --version`;
    try {
      const v = await execCommand(
        new Command({ darwin: cmd, linux: cmd, win32: cmd }),
      );
      const major = v.split(" ")[1].split(".")[0];
      const minor = v.split(" ")[1].split(".")[1];
      return +major >= version.major && +minor >= version.minor;
    } catch (err) {
      return false;
    }
  }

  async discoverAllPaths() {
    await this.gatherPathsFromDefaultBin();
    const condaEnvs = await this.getCondaEnvs();
    if (condaEnvs) {
      this.executables = this.executables.concat(condaEnvs);
    }
    const defaultPy = await this.getGlobalPython();
    if (defaultPy) {
      this.executables.push(defaultPy);
    }
    return this.executables;
  }

  async processInterpreters() {
    const interpreters = await this.discoverAllPaths();
    const visited = new Set();
    const list: InterpretersList = [];
    for (const interpreter of interpreters) {
      if (visited.has(interpreter)) {
        continue;
      }
      visited.add(interpreter);
      const cmd = `${interpreter} --version`;
      const version = await execCommand(
        new Command({
          darwin: cmd,
          linux: cmd,
          win32: cmd,
        }),
      );
      const interpreterInfo: InterpretersList[0] = {
        path: interpreter,
        version: {
          major: +version.split(" ")[1].split(".")[0],
          minor: +version.split(" ")[1].split(".")[1],
        },
        default: false,
      };
      list.push(interpreterInfo);
    }
    return list;
  }
  async getInterpreterByVersion(version: { major: number; minor: number }) {
    const interpreters = await this.processInterpreters();
    const filterInterpreters = interpreters.filter(
      (interpreter) =>
        interpreter.version.major >= version.major &&
        interpreter.version.minor >= version.minor,
    );
    return filterInterpreters;
  }
}
export const pythonManager = new PythonManager();

export const handlePythonInterpreter = async (_, interpreter: string) => {
  const cmd = `${interpreter} -c "import sys; print(';'.join(sys.path))"`;
  const paths = await execCommand(
    new Command({
      darwin: cmd,
      linux: cmd,
      win32: cmd,
    }),
  );
  const pathArr: string[] = [];
  paths.split(";").forEach((p) => {
    if (p) {
      pathArr.push(p);
    }
  });
  process.env.PY_INTERPRETER = interpreter;
  swapPath(pathArr.join(":"));
};

const swapPath = (path: string) => {
  let envPath = process.env.PATH ?? "";
  const oldPath = process.env.OLD_PATH ?? "";
  if (envPath.includes(oldPath)) {
    envPath = envPath.replaceAll(oldPath, "");
  }
  process.env.OLD_PATH = path;
  process.env.PATH = `${path}:${envPath}`;
};

export const browsePyhtonInterpreter = async () => {
  const selectedPaths = dialog.showOpenDialogSync(global.mainWindow, {
    buttonLabel: "Select",
    properties: ["openFile"],
  });

  if (selectedPaths?.length) {
    const path = selectedPaths[0];
    const replaceChar = path.replaceAll("\\", "/");
    const splitPath = replaceChar.split("/");
    const isPythonExec = PythonManager.isPythonFile(
      splitPath[splitPath.length - 1],
    );
    if (isPythonExec) {
      const matchVersion = await PythonManager.checkVersion(path, {
        major: 3,
        minor: 11,
      });
      if (matchVersion) {
        return path;
      }
      dialog.showErrorBox(
        "Version does not match!",
        "Selected interpreter does not fulfill version requirement of ~3.11 !",
      );
      return null;
    }
    dialog.showErrorBox(
      "Not a Python interpreter!",
      "Selected file is not a Python interpreter!",
    );
    return null;
  }
  return null;
};
