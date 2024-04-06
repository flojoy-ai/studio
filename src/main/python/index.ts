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
import { existsSync, mkdirSync, readFileSync } from "fs";
import { poetryGroupEnsureValid } from "./poetry";
import { store } from "../store";
import { join } from "path";

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
    const matchedVersion = await PythonManager.checkVersion(interpreter, {
      major: 3,
      minor: 11,
    });
    if (matchedVersion) {
      const foundInterpreterInList = global.pythonInterpreters.find(
        (i) => i.path === interpreter,
      );
      if (foundInterpreterInList) {
        global.pythonInterpreters = global.pythonInterpreters.map((i) => ({
          ...i,
          default: i.path === interpreter ? true : false,
        }));
      } else {
        global.pythonInterpreters.push({
          path: interpreter,
          version: {
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
      darwin: `"${py}" -m pip install --user pipx==1.5.0 --break-system-packages`,
      win32: `"${py}" -m pip install --user pipx==1.5.0`,
      linux: `"${py}" -m pip install --user pipx==1.5.0 --break-system-packages`,
    }),
  );
}

export async function pipxEnsurepath(): Promise<void> {
  const py = process.env.PY_INTERPRETER ?? "python";
  const pipxBinScript =
    "import pipx.commands.ensure_path;import pipx.paths;script=pipx.commands.ensure_path.get_pipx_user_bin_path();bin=pipx.paths.DEFAULT_PIPX_BIN_DIR;print(bin,';',script)";
  const pipxBinPath = await execCommand(
    new Command(`"${py}" -c "${pipxBinScript}"`),
    { quiet: true },
  );
  const trimmedPath = pipxBinPath.trim().split(" ").join("");
  const existingPaths = process.env.PATH;

  log.info("pipxEnsurepath: " + trimmedPath);
  log.info("existingPaths: " + existingPaths);

  if (!existingPaths?.includes(trimmedPath)) {
    process.env.PATH = `${trimmedPath}:${existingPaths}`;
  }
}

export async function installPoetry(): Promise<void> {
  log.info("PIPX_HOME: " + process.env.PIPX_HOME);
  log.info("PIPX_BIN_DIR: " + process.env.PIPX_BIN_DIR);

  await execCommand(
    new Command({
      darwin: `chmod +x ${process.env.PIPX_BIN_DIR}`,
      win32: `dir`,
      linux: `ls`,
    }),
  );

  const py = process.env.PY_INTERPRETER ?? "python";
  const localDir = join(os.homedir(), ".local");
  if (!existsSync(localDir)) {
    mkdirSync(localDir);
  }
  const defaultPipxDir = join(localDir, "pipx");
  if (!existsSync(defaultPipxDir)) {
    mkdirSync(defaultPipxDir);
  }
  process.env.PIPX_HOME = defaultPipxDir;
  await execCommand(new Command(`"${py}" -m pipx install poetry --force`));
  const poetryPath = await getPoetryPath();
  process.env.POETRY_PATH = poetryPath;
}

export async function installDependencies(): Promise<string> {
  const poetry = process.env.POETRY_PATH ?? "poetry";

  const validGroups = await poetryGroupEnsureValid();
  if (validGroups.length > 0) {
    return await execCommand(
      new Command(
        `${poetry} install --sync --with ${validGroups.join(",")} --no-root`,
      ),
    );
  }
  return await execCommand(new Command(`${poetry} install --no-root`));
}

export async function spawnCaptain(): Promise<void> {
  return new Promise((_, reject) => {
    const poetry = process.env.POETRY_PATH ?? "poetry";
    const command = new Command(`${poetry} run python main.py`);

    log.info("execCommand: " + command.getCommand());

    global.captainProcess = spawn(
      command.getCommand().split(" ")[0],
      command.getCommand().split(" ").slice(1),
      {
        cwd: app.isPackaged ? process.resourcesPath : undefined,
        env: {
          ...process.env,
          LOCAL_DB_PATH: store.path,
        },
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
        reject("Captain process is exited with code " + code);
      }
    });
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

export async function listPythonPackages() {
  const poetry = process.env.POETRY_PATH ?? "poetry";
  return await execCommand(new Command(`"${poetry}" run pip freeze`), {
    quiet: true,
  });
}

export async function pyvisaInfo() {
  const poetry = process.env.POETRY_PATH ?? "poetry";
  return await execCommand(new Command(`"${poetry}" run pyvisa-info`), {
    quiet: true,
  });
}

const getPoetryPath = async () => {
  const localBinPath = `${os.homedir}/.local/bin/poetry`;
  try {
    await execCommand(new Command(localBinPath), { quiet: true });
    return localBinPath;
  } catch (error) {
    return "poetry";
  }
};

export async function restartCaptain() {
  if (!global.captainProcess?.killed) {
    const killed = global.captainProcess?.kill();
    while (!killed) {
      continue;
    }
  }
  await spawnCaptain();
}
