export type Summary = {
  id: string;
  successRate: number;
  completionTime: number;
};

export type LockedContextType = {
  isLocked: boolean;
};

export type TestTypes = "Pytest" | "Python" | "Flojoy" | "Matlab";

export type StatusTypes = "pending" | "pass" | "failed";

export type MsgState =
  | "TEST_SET_START"
  | "RUNNING"
  | "TEST_DONE"
  | "ERROR"
  | "TEST_SET_DONE";

export type BackendMsg = {
  state: MsgState;
  target_id: string;
  result: boolean;
  time_taken: number;
  is_saved_to_cloud: boolean;
  error: string | null;
};

export type Test = {
  type: "test";
  id: string;
  groupId: string;
  path: string;
  testName: string;
  runInParallel: boolean;
  testType: TestTypes;
  status: StatusTypes;
  completionTime: number | undefined;
  isSavedToCloud: boolean;
};

export type Conditional = {
  type: "conditional";
  conditionalType: ConditionalComponent;
  role: Role;
  id: string;
  groupId: string;
  condition: string;
};

export type Role = "start" | "between" | "end"; //for example, "if" is a "start", "else" is a "between" and "end" is an "end"
export type ConditionalComponent = "if" | "else" | "elif" | "end";
export type ConditionalLeader = "if";
export const CONDITIONALS: ConditionalLeader[] = ["if"];

export type TestSequenceElement = Test | Conditional;

/* DEFINITIONS FOR TREE STRUCTURE OF TEST SEQUENCER */

export type IfNode = Conditional & {
  conditionalType: "if";
  main: TestSequenceElementNode[];
  else: TestSequenceElementNode[];
};

export type ConditionalNode = IfNode;

export type TestNode = Test;

export type TestRootNode = {
  type: "root";
  children: TestSequenceElementNode[];
  identifiers: string[];
};

export type TestSequenceElementNode = ConditionalNode | TestNode | TestRootNode;

export type TestDiscoverContainer = {
  // sync with pydantic model in backend
  response: TestDiscoveryResponse[];
  missingLibraries: string[];
};

export type TestDiscoveryResponse = {
  // sync with pydantic model in backend
  testName: string;
  path: string;
};
