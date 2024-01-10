import { useAtom } from "jotai";
import { Conditional, Test } from "@src/types/testSequencer";
import { atomWithImmer } from "jotai-immer";

export const elements = atomWithImmer<(Test | Conditional)[]>([
  {
    type: "test",
    id: "m5gr84i9",
    test_name: "test_voltage.py",
    run_in_parallel: false,
    test_type: "Python",
    status: "pass",
    completion_time: 1,
    is_saved_to_cloud: true,
  },
  {
    type: "test",
    id: "iqyubqCHB",
    test_name: "measure_width.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "failed",
    completion_time: 3,
    is_saved_to_cloud: true,
  },
  {
    type: "test",
    id: "aiubv123uajksc",
    test_name: "measure_height.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "pass",
    completion_time: 3.2,
    is_saved_to_cloud: false,
  },
  {
    type: "test",
    id: "ashd21319DBASA",
    test_name: "cap_vs_freq.m",
    run_in_parallel: true,
    test_type: "Matlab",
    status: "pass",
    completion_time: 4,
    is_saved_to_cloud: true,
  },
]);

export function useTestSequencerState() {
  const [elems, setElements] = useAtom(elements);
  return {
    elems,
    setElements,
  };
}
