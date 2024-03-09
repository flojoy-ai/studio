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
  isSavedToCloud: z.boolean(),
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

export const TestDiscoveryResponse = z.object({
  testName: z.string(),
  path: z.string(),
});

export type TestDiscoveryResponse = z.infer<typeof TestDiscoveryResponse>;

export const TestDiscoverContainer = z.object({
  response: TestDiscoveryResponse.array(),
  missingLibraries: z.string().array(),
});

export type TestDiscoverContainer = z.infer<typeof TestDiscoverContainer>;

/* DEFINITIONS FOR PROJECT */
export const InterpreterType = z.enum(["flojoy", "poetry", "pipenv", "conda"]);

export const Interpreter = z.object({
  type: InterpreterType,
  path: z.union([z.null(), z.string()]),
  requirementsPath: z.union([z.null(), z.string()]),
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
