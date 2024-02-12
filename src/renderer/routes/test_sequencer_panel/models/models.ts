import { TestRootNode } from "@/renderer/types/testSequencer";

export type TestSequenceEvents = "run" | "subscribe";

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
