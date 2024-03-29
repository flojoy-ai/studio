import { TestRootNode } from "@/renderer/types/test-sequencer";

export type TestSequenceEvents =
  | "run"
  | "stop"
  | "subscribe"
  | "export"
  | "pause"
  | "resume";
type CloudId = string | null;

export type TestSequenceRun = {
  event: TestSequenceEvents;
  data: TestRootNode;
  hardware_id: CloudId;
  project_id: CloudId;
};

export const testSequenceRunRequest: (tree: TestRootNode) => TestSequenceRun = (
  tree: TestRootNode,
) => {
  return {
    event: "run",
    data: tree,
    hardware_id: null,
    project_id: null,
  };
};

export const testSequenceStopRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "stop",
    data: tree,
    hardware_id: null,
    project_id: null,
  };
};

export const testSequenceResumeRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "resume",
    data: tree,
    hardware_id: null,
    project_id: null,
  };
};

export const testSequencePauseRequest: (
  tree: TestRootNode,
) => TestSequenceRun = (tree: TestRootNode) => {
  return {
    event: "pause",
    data: tree,
    hardware_id: null,
    project_id: null,
  };
};

export const testSequenceExportCloud: (
  tree: TestRootNode,
  hardware_id: string,
  project_id: string,
) => TestSequenceRun = (
  tree: TestRootNode,
  hardware_id: string,
  project_id: string,
) => {
  return {
    event: "export",
    data: tree,
    hardware_id: hardware_id,
    project_id: project_id,
  };
};
