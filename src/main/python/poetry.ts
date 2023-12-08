import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { Command } from "../command";
import { execCommand } from "../executor";
import pyproject from "../../../pyproject.toml?raw";
import toml from "toml";
import { store } from "../store";

// FIXME: do not hardcode the groups here
export const POETRY_DEP_GROUPS: Pick<
  PoetryGroupInfo,
  "name" | "description"
>[] = [
  {
    name: "blocks",
    description: "Core dependencies for Flojoy Blocks",
  },
  {
    name: "dev",
    description: "Development dependencies for Flojoy Studio",
  },
  {
    name: "ai-ml",
    description: "AI and Machine Learning dependencies",
  },
  {
    name: "hardware",
    description: "Hardware dependencies",
  },
];

export async function poetryShowTopLevel(): Promise<PythonDependency[]> {
  const groups = POETRY_DEP_GROUPS.map((group) => group.name).join(",");
  const result = await execCommand(
    new Command(`poetry show --top-level --with ${groups} --no-ansi`),
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

      // TODO: Implement actual outdated checking
      return {
        name: key,
        dependencies,
        description:
          POETRY_DEP_GROUPS.find((group) => group.name === key)?.description ??
          "Unknown (depGroups needs to be updated!)",
        status: (dependencies.every((dep) => dep.installed)
          ? "installed"
          : "dne") as PoetryGroupInfo["status"],
      };
    },
  );
  return result;
}

export async function poetryInstallDepGroup(group: string): Promise<boolean> {
  await execCommand(new Command(`poetry install --with ${group} --no-root`));

  if (group !== "blocks") {
    const groups = store.get("poetryOptionalGroups") as string[];
    if (!groups.includes(group)) {
      store.set("poetryOptionalGroups", [...groups, group]);
    }
  }

  return true;
}

export async function poetryUninstallDepGroup(group: string): Promise<boolean> {
  await execCommand(
    new Command(`poetry install --sync --without ${group} --no-root`),
  );

  if (group !== "blocks") {
    const groups = store.get("poetryOptionalGroups") as string[];
    if (groups) {
      const newGroups = groups.filter((g: string) => g !== group);
      store.set("poetryOptionalGroups", newGroups);
    }
  }

  return true;
}
