import { TestRootNode } from "@/renderer/types/test-sequencer";

export type TestSequenceEvents =
  | "run"
  | "stop"
  | "subscribe"
  | "pause"
  | "resume";

export type TestSequenceRun = {
  event: TestSequenceEvents;
  data: TestRootNode;
};

export const testSequenceRunRequest: (tree: TestRootNode) => TestSequenceRun = (
  tree: TestRootNode,
) => {
  return {
    event: "run",
    data: tree,
  };
};

export const testSequenceStopRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "stop",
    data: tree,
  };
};

export const testSequenceResumeRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "resume",
    data: tree,
  };
};

export const testSequencePauseRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "pause",
    data: tree,
  };
};
