import { StatusType } from "@/renderer/types/testSequencer";

const mapToStatus: {
  [key: string]: StatusType;
} = {
  false: "failed",
  true: "pass",
};

export const mapToTestResult = (result: boolean) => {
  return mapToStatus[result.toString()];
};
