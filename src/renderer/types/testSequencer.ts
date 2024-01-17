export type Summary = {
  id: string;
  success_rate: number;
  completion_time: number;
};

export type Test = {
  type: "test";
  id: string;
  path: string;
  test_name: string;
  run_in_parallel: boolean;
  test_type: "Python" | "Flojoy" | "Matlab";
  status: "pending" | "processing" | "pass" | "failed";
  completion_time: number;
  is_saved_to_cloud: boolean;
};

export type Conditional = {
  type: "conditional";
  conditional_type: CONDITIONAL_TYPES;
  role: ROLE_TYPES;
  id: string;
  groupId: string;
  condition: string;
};

export type ROLE_TYPES = "start" | "between" | "end"; //for example, "if" is a "start", "else" is a "between" and "end" is an "end"
export type CONDITIONAL_TYPES = "if" | "else" | "elif" | "end";
export const CONDITIONALS = ["if"];

export type TestSequenceElement = Test | Conditional;

/* DEFINITIONS FOR TREE STRUCTURE OF TEST SEQUENCER */

export type IfNode = Conditional & {
  conditional_type: "if";
  main: TestSequenceElementNode[];
  else: TestSequenceElementNode[];
};

export type ConditionalNode = IfNode;

export type TestNode = Test;

export type RootNode = {
  type: "root";
  children: TestSequenceElementNode[];
};

export type TestSequenceElementNode = ConditionalNode | TestNode | RootNode;
