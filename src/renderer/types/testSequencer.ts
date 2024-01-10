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
  type: "if" | "else if" | "else";
  condition: string;
};

export type TestSequenceElement = Test | Conditional;
