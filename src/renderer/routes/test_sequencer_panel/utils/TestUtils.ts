import { StatusType } from "@/renderer/types/test-sequencer";

const mapToStatus: {
  [key: string]: StatusType;
} = {
  false: "failed",
  true: "pass",
};

export const mapToTestResult = (result: boolean) => {
  return mapToStatus[result.toString()];
};
