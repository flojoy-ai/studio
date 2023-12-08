export type PoetryGroupInfo = {
  groupName: string;
  dependencies: PythonDependency[];
};

export type PythonDependency = {
  name: string;
  version: string;
  description?: string;
};
