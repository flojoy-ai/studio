export type Summary = {
  id: string;
  success_rate: number;
  completion_time: number;
};

export type Test = {
  type: "test";
  id: string;
  test_name: string;
  run_in_parallel: boolean;
  test_type: "Python" | "Flojoy" | "Matlab";
  status: "pending" | "processing" | "pass" | "failed";
  completion_time: number;
  is_saved_to_cloud: boolean;
};

export type Conditional = {
  id: string;
  type: CONDITIONAL_TYPES;
  condition: string;
};

export type CONDITIONAL_TYPES = "if" | "else" | "elif" | "end";
export const CONDITIONALS = ["if", "else", "elif", "end"];

export type TestSequenceElement = Test | Conditional;
