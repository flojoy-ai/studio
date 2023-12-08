import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { Command } from "../command";
import { execCommand } from "../executor";
import pyproject from "../../../pyproject.toml?raw";
import toml from "toml";

export async function poetryShowTopLevel(): Promise<PythonDependency[]> {
  // FIXME: do not hardcode the groups here
  const result = await execCommand(
    new Command("poetry show --top-level --with dev,ai-ml,hardware --no-ansi"),
  );

  return result.split("\n").map((line) => {
    // Example line output
    // keyrings-cryptfile        1.3.9              Encrypted file keyring backend
    // labjackpython         (!) 2.1.0              The LabJack Python modules for the LabJack U3, U6, UE9 and U12.

    const splitted = line.split(/\s+/);

    if (splitted[1] === "(!)") {
      // This case it means it is not installed

      return {
        name: splitted[0],
        version: splitted[2],
        description: splitted.slice(3).join(" "),
        installed: false,
      };
    }
    return {
      name: splitted[0],
      version: splitted[1],
      description: splitted.slice(2).join(" "),
      installed: true,
    };
  });
}

export async function poetryGetGroupInfo(): Promise<PoetryGroupInfo[]> {
  const topLevels = await poetryShowTopLevel();

  const parsed = toml.parse(pyproject);
  const result = Object.entries(parsed["tool"]["poetry"]["group"]).map(
    ([key, value]) => {
      const dependencies = Object.entries(
        (value as Map<string, unknown>)["dependencies"],
      ).map(([key, value]) => {
        return {
          name: key,
          version: value as string,
          installed: topLevels.some((dep) => dep.name === key && dep.installed),
        };
      });

      console.log(dependencies);
      // TODO: Implement actual outdated checking
      return {
        name: key,
        dependencies,
        status: (dependencies.every((dep) => dep.installed)
          ? "installed"
          : dependencies.some((dep) => dep.installed)
            ? "outdated"
            : "dne") as PoetryGroupInfo["status"],
      };
    },
  );
  console.log(result);
  return result;
}

export async function poetryInstallDepGroup(group: string): Promise<boolean> {
  await execCommand(new Command(`poetry install --with ${group} --no-root`));
  return true;
}

export async function poetryUninstallDepGroup(group: string): Promise<boolean> {
  await execCommand(
    new Command(`poetry install --sync --without ${group} --no-root`),
  );
  return true;
}
