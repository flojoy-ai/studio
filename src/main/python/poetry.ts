import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { Command } from "../command";
import { execCommand } from "../executor";

export async function poetryShowTopLevel(): Promise<PythonDependency[]> {
  const result = await execCommand(new Command("poetry show --top-level"));

  return result.split("\n").map((line) => {
    const splitted = line.split(/\s+/);
    return {
      name: splitted[0],
      version: splitted[1],
      description: splitted.slice(2).join(" "),
    };
  });
}

export async function poetryGetGroupInfo(): Promise<PoetryGroupInfo[]> {
  return [];
}
