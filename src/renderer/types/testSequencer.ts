import { z } from "zod";

export type Summary = {
  id: string;
  successRate: number;
  completionTime: number;
};

export type LockedContextType = {
  isLocked: boolean;
};

export const TestType = z.enum(["pytest", "python", "flojoy", "matlab"]);
export type TestType = z.infer<typeof TestType>;

export const StatusType = z.enum(["pending", "pass", "failed"]);
export type StatusType = z.infer<typeof StatusType>;

export const MsgState = z.enum([
  "test_set_start",
  "test_set_export",
  "test_set_done",
  "running",
  "test_done",
  "error",
]);
export type MsgState = z.infer<typeof MsgState>;

export const BackendMsg = z.object({
  state: MsgState,
  target_id: z.string(),
  result: z.boolean(),
  time_taken: z.number(),
  is_saved_to_cloud: z.boolean(),
  error: z.string().nullable(),
});
export type BackendMsg = z.infer<typeof BackendMsg>;

export type Test = {
  type: "test";
  id: string;
  groupId: string;
  path: string;
  testName: string;
  runInParallel: boolean;
  testType: TestType;
  status: StatusType;
  error: string | null;
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

// for example, "if" is a "start", "else" is a "between" and "end" is an "end"
export type Role = "start" | "between" | "end";

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
