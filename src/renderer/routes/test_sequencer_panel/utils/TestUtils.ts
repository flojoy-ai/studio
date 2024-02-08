import { StatusTypes } from "@/renderer/types/testSequencer";

const mapToStatus: {
  [key: string]: StatusTypes;
} = {
  false: "failed",
  true: "pass",
};

export const mapToTestResult = (result: boolean) => {
  return mapToStatus[result.toString()];
};
