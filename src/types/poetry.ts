export type PoetryGroupInfo = {
  name: string;
  description: string;
  dependencies: PythonDependency[];
  status: "installed" | "dne";
};

export type PythonDependency = {
  name: string;
  version: string;
  description?: string;
  installed: boolean;
};
