import log from "electron-log/main";
import { execCommand } from "../executor";
import { app } from "electron";
import { Command } from "../command";
import { ChildProcess, execSync, spawn } from "child_process";
import { sendToStatusBar } from "../logging";
import {
  InterpretersList,
  PythonManager,
  interpreterCachePath,
} from "./interpreter";
import * as os from "os";
import { existsSync, readFileSync } from "fs";

export async function checkPythonInstallation(
  _,
  force?: boolean,
): Promise<InterpretersList> {
  if (!global.pythonInterpreters || force) {
    global.pythonInterpreters =
      await new PythonManager().getInterpreterByVersion({
        major: 3,
        minor: 11,
      });
  }
  if (existsSync(interpreterCachePath)) {
    const interpreter = readFileSync(interpreterCachePath).toString("utf-8");
    if (existsSync(interpreter)) {
      const foundInList = global.pythonInterpreters.find(
        (i) => i.path === interpreter,
      );
      if (foundInList) {
        global.pythonInterpreters = global.pythonInterpreters.map((i) =>
          i.path === interpreter
            ? {
                ...i,
                default: true,
              }
            : i,
        );
      } else {
        global.pythonInterpreters.push({
          path: interpreter,
          version: (await PythonManager.getVersion(interpreter)) ?? {
            major: 3,
            minor: 11,
          },
          default: true,
        });
      }
    }
  }
  return global.pythonInterpreters;
}

export async function installPipx(): Promise<string> {
  const py = process.env.PY_INTERPRETER ?? "python";
  return await execCommand(
    new Command({
      darwin: `"${py}" -m pip install --user pipx`,
      win32: `"${py}" -m pip install --user pipx`,
      linux: `"${py}" -m pip install --user pipx --break-system-packages`,
    }),
  );
}

export async function pipxEnsurepath(): Promise<void> {
  const py = process.env.PY_INTERPRETER ?? "python";
  const pipxBinScript =
    "import pipx.commands.ensure_path;import pipx.constants;script=pipx.commands.ensure_path.get_pipx_user_bin_path();bin=pipx.constants.DEFAULT_PIPX_BIN_DIR;print(bin,';',script)";
  const pipxBinPath = await execCommand(
    new Command(`"${py}" -c "${pipxBinScript}"`),
    { quiet: true },
  );

  process.env.PATH = `${pipxBinPath.trim().split(" ").join("")}:${
    process.env.PATH
  }`;
}

export async function installPoetry(): Promise<string> {
  const py = process.env.PY_INTERPRETER ?? "python";
  process.env.POETRY_PATH = `${os.homedir}/.local/bin/poetry`;
  return await execCommand(new Command(`${py} -m pipx install poetry --force`));
}

export async function installDependencies(): Promise<string> {
  const poetry = process.env.POETRY_PATH ?? "poetry";
  return await execCommand(new Command(`${poetry} install`));
}

export async function spawnCaptain(): Promise<void> {
  const poetry = process.env.POETRY_PATH ?? "poetry";
  const command = new Command(`${poetry} run python main.py`);

  log.info("execCommand: " + command.getCommand());

  global.captainProcess = spawn(
    command.getCommand().split(" ")[0],
    command.getCommand().split(" ").slice(1),
    {
      cwd: app.isPackaged ? process.resourcesPath : undefined,
    },
  );

  global.captainProcess.stdout?.on("data", (data) => {
    log.info(data.toString());
    sendToStatusBar(data.toString());
  });

  global.captainProcess.stderr?.on("data", (data) => {
    log.error(data.toString());
    sendToStatusBar(data.toString());
  });

  global.captainProcess.on("error", (error) => {
    log.error(error.message);
    sendToStatusBar(error.message);
  });

  global.captainProcess.on("exit", (code) => {
    if (code !== 0 && !global?.mainWindow?.isDestroyed()) {
      throw new Error("Captain process is exited with code " + code);
    }
  });
}

export function killCaptain(): boolean {
  if (process.platform === "win32") {
    try {
      execSync(
        `taskkill -F -T -PID ${(global.captainProcess as ChildProcess).pid}`,
      );
      return true;
    } catch (err) {
      log.error(err);
      return false;
    }
  }
  return (global.captainProcess as ChildProcess).kill();
}
