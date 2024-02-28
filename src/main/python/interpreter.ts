import { readdir, stat } from "fs";
import { join } from "path";
import os from "os";
import { execCommand } from "@/main/executor";
import { Command } from "@/main/command";
import { app, dialog } from "electron";
import { writeFileSync } from "@/main/utils";
import { z } from "zod";

export type InterpretersList = {
  path: string;
  default: boolean;
  version: {
    major: number;
    minor: number;
  };
}[];

const CondaInfo = z.object({
  envs: z.array(z.string()),
});

export const interpreterCachePath = join(
  app.getPath("appData"),
  "flojoy_py_interpreter",
);
export class PythonManager {
  defaultBinPaths = {
    darwin: [
      "/usr/bin",
      "/usr/local/bin",
      "/opt/local/bin",
      "/opt/homebrew/bin",
      os.homedir() + "/.pyenv/shims",
      os.homedir() + "/miniconda3/bin",
    ],
    win32: [
      os.homedir() + "/miniconda3",
      join(process.env.LOCALAPPDATA ?? "", "Programs/Python/Python310"),
      join(process.env.LOCALAPPDATA ?? "", "Programs/Python/Python311"),
      join(process.env.ProgramFiles ?? "", "python311"),
    ],
    linux: ["/usr/bin", "/usr/local/bin", os.homedir() + "/.pyenv/shims"],
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
  private async getCondaCmd() {
    let cmd = "conda";
    try {
      await execCommand(new Command(cmd), { quiet: true });
    } catch (error) {
      try {
        if (process.platform === "win32") {
          cmd = `"${os.homedir()}/miniconda3/Scripts/conda.exe"`;
          await execCommand(new Command(cmd), { quiet: true });
        } else {
          cmd = `"${os.homedir()}/miniconda3/bin/conda"`;
          await execCommand(new Command(cmd), { quiet: true });
        }
      } catch (error) {
        cmd = "";
      }
    }
    return cmd;
  }

  async getCondaEnvs() {
    const conda = await this.getCondaCmd();
    if (conda === "") {
      return null;
    }
    const cmd = `${conda} info --json`;

    try {
      const condaInfo = await execCommand(new Command(cmd), { quiet: true });

      const parsedInfo = CondaInfo.parse(condaInfo);

      const envPaths = parsedInfo.envs.map((env) => {
        if (process.platform === "win32") {
          return join(env, "python.exe");
        }
        return join(env, "bin", "python");
      });

      return envPaths;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getGlobalPython() {
    try {
      const cmd = `python -c "import sys; print(sys.executable)"`;
      const defaultPythonPath = await execCommand(new Command(cmd));
      return defaultPythonPath.trim();
    } catch (err) {
      return null;
    }
  }

  static isPythonFile(fullFileName: string) {
    let fileName = fullFileName;
    if (process.platform === "win32") {
      if (!fullFileName.includes(".exe")) {
        return false;
      }
      fileName = fullFileName.split(".exe")[0];
    }
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
    const cmd = `"${interpreter}" --version`;
    try {
      const v = await execCommand(new Command(cmd));
      const major = v.split(" ")[1].split(".")[0];
      const minor = v.split(" ")[1].split(".")[1];
      return +major == version.major && +minor == version.minor;
    } catch (err) {
      return false;
    }
  }

  static async getVersion(interpreter: string) {
    try {
      const cmd = `"${interpreter}" --version`;
      const version = await execCommand(new Command(cmd));
      return {
        major: +version.split(" ")[1].split(".")[0],
        minor: +version.split(" ")[1].split(".")[1],
      };
    } catch (error) {
      return null;
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
      const cmd = `"${interpreter}" --version`;
      try {
        const version = await execCommand(new Command(cmd), { quiet: true });
        const interpreterInfo: InterpretersList[0] = {
          path: interpreter,
          version: {
            major: +version.split(" ")[1].split(".")[0],
            minor: +version.split(" ")[1].split(".")[1],
          },
          default: false,
        };
        list.push(interpreterInfo);
      } catch (error) {
        continue;
      }
    }
    return list;
  }
  async getInterpreterByVersion(version: { major: number; minor: number }) {
    const interpreters = await this.processInterpreters();
    const filterInterpreters = interpreters.filter(
      (interpreter) =>
        interpreter.version.major == version.major &&
        interpreter.version.minor == version.minor,
    );
    return filterInterpreters;
  }
}

export const handlePythonInterpreter = async (_, interpreter: string) => {
  const cmd = `"${interpreter}" -c "import sys; print(';'.join(sys.path))"`;
  const paths = await execCommand(new Command(cmd), { quiet: true });
  const pathArr: string[] = [];
  paths.split(";").forEach((p) => {
    if (p) {
      pathArr.push(p.trim());
    }
  });
  process.env.PY_INTERPRETER = interpreter;
  writeFileSync(undefined, interpreterCachePath, interpreter);
  swapPath(pathArr.join(":"));
};

const swapPath = (path: string) => {
  let envPath = process.env.PATH ?? "";
  const oldPath = process.env.OLD_PATH ?? "";
  if (envPath.includes(oldPath)) {
    envPath = envPath.replaceAll(oldPath, "");
  }
  process.env.OLD_PATH = path;
  process.env.PATH = `${path.trim()}:${envPath}`;
};

export const browsePythonInterpreter = async () => {
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
