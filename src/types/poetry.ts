export type PoetryGroupInfo = {
  name: string;
  dependencies: PythonDependency[];
  status: "installed" | "outdated" | "dne";
};

export type PythonDependency = {
  name: string;
  version: string;
  description?: string;
  installed: boolean;
};
