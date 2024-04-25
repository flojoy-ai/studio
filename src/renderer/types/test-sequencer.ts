import { z } from "zod";

export type LockedContextType = {
  isLocked: boolean;
};

export const TestType = z.enum([
  "pytest",
  "python",
  "placeholder",
  "robotframework",
]);
export type TestType = z.infer<typeof TestType>;

export const ResultType = z.enum(["pass", "fail", "aborted"]);
export type ResultType = z.infer<typeof ResultType>;

export const StatusType = z.union([
  ResultType,
  z.enum(["pending", "running", "paused"]),
]);
export type StatusType = z.infer<typeof StatusType>;

export const MsgState = z.enum([
  "test_set_start",
  "test_set_export",
  "test_set_done",
  "running",
  "paused",
  "test_done",
  "error",
]);
export type MsgState = z.infer<typeof MsgState>;

export const BackendGlobalState = z.enum([
  "test_set_start",
  "test_set_export",
  "test_set_done",
  "error",
]);
export type BackendGlobalState = z.infer<typeof BackendGlobalState>;

export const CycleConfig = z.object({
  infinite: z.boolean(),
  cycleCount: z.number(),
  ptrCycle: z.number(),
});
export type CycleConfig = z.infer<typeof CycleConfig>;

export const BackendMsg = z.object({
  state: MsgState,
  target_id: z.string(),
  status: StatusType,
  time_taken: z.number(),
  created_at: z.string(),
  is_saved_to_cloud: z.boolean(),
  error: z.string().nullable(),
  value: z.number().nullable(),
});
export type BackendMsg = z.infer<typeof BackendMsg>;

export const Test = z.object({
  type: z.literal("test"),
  id: z.string(),
  groupId: z.string(),
  path: z.string(),
  testName: z.string(),
  runInParallel: z.boolean(),
  testType: TestType,
  status: StatusType,
  error: z.string().nullable(),
  completionTime: z.number().optional(),
  createdAt: z.string().optional(),
  isSavedToCloud: z.boolean(),
  exportToCloud: z.boolean(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  measuredValue: z.number().optional(),
  unit: z.string().optional(),
  args: z.string().array().optional(),
});

export type Test = z.infer<typeof Test>;

// for example, "if" is a "start", "else" is a "between" and "end" is an "end"
export const Role = z.enum(["start", "between", "end"]);
export type Role = z.infer<typeof Role>;

export const ConditionalComponent = z.enum(["if", "else", "elif", "end"]);
export type ConditionalComponent = z.infer<typeof ConditionalComponent>;

export const Conditional = z.object({
  type: z.literal("conditional"),
  conditionalType: ConditionalComponent,
  role: Role,
  id: z.string(),
  groupId: z.string(),
  condition: z.string(),
});

export type Conditional = z.infer<typeof Conditional>;

export type ConditionalLeader = "if";
export const CONDITIONALS: ConditionalLeader[] = ["if"];

export const TestSequenceElement = z.discriminatedUnion("type", [
  Test,
  Conditional,
]);

export type TestSequenceElement = z.infer<typeof TestSequenceElement>;

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

export const TestDiscoveryResponse = z.object({
  testName: z.string(),
  path: z.string(),
});

export type TestDiscoveryResponse = z.infer<typeof TestDiscoveryResponse>;

export const TestDiscoverContainer = z.object({
  response: TestDiscoveryResponse.array(),
  missingLibraries: z.string().array(),
  error: z.string().nullable(),
});

export type TestDiscoverContainer = z.infer<typeof TestDiscoverContainer>;

/* DEFINITIONS FOR PROJECT */
export const InterpreterType = z.enum(["flojoy", "poetry", "pipenv", "conda"]);
export type InterpreterType = z.infer<typeof InterpreterType>;

export const Interpreter = z.object({
  type: InterpreterType,
  path: z.string().nullable(),
  requirementsPath: z.string().nullable(),
});

export type Interpreter = z.infer<typeof Interpreter>;

export const TestSequencerProject = z.object({
  name: z.string(),
  description: z.string(),
  elems: TestSequenceElement.array(),
  projectPath: z.string(),
  interpreter: Interpreter,
});

export type TestSequencerProject = z.infer<typeof TestSequencerProject>;

export type TestSequenceContainer = {
  project: TestSequencerProject;
  tree: TestRootNode;
  elements: TestSequenceElement[];
  status: StatusType;
  testSequenceUnsaved: boolean;
  runable: boolean;
};
