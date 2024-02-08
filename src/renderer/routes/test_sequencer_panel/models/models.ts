import { TestRootNode } from "@/renderer/types/testSequencer";

export type TestSequenceRun = {
  event: "run";
  data: {
    tree: TestRootNode;
  };
};

export const testSequenceRunRequest = (tree: TestRootNode) => {
  return {
    event: "run",
    data: {
      tree: tree,
    },
  };
};
