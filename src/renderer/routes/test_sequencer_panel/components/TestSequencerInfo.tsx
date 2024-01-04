import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { IS_CLOUD_DEMO } from "@src/data/constants";
import { useState } from "react";
import { DataTable } from "./DataTable";
import { SummaryTable } from "./SummaryTable";

export type Test = {
  id: string;
  test_name: string;
  run_in_parallel: boolean;
  test_type: "Python" | "Flojoy" | "Matlab";
  status: "pending" | "processing" | "pass" | "failed";
  completion_time: number;
  is_saved_to_cloud: boolean;
};

const data: Test[] = [
  {
    id: "m5gr84i9",
    test_name: "test_voltage.py",
    run_in_parallel: false,
    test_type: "Python",
    status: "pass",
    completion_time: 1,
    is_saved_to_cloud: true,
  },
  {
    id: "iqyubqCHB",
    test_name: "measure_width.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "failed",
    completion_time: 3,
    is_saved_to_cloud: true,
  },
  {
    id: "aiubv123uajksc",
    test_name: "measure_height.json",
    run_in_parallel: false,
    test_type: "Flojoy",
    status: "pass",
    completion_time: 3.2,
    is_saved_to_cloud: false,
  },
  {
    id: "ashd21319DBASA",
    test_name: "cap_vs_freq.m",
    run_in_parallel: true,
    test_type: "Matlab",
    status: "pass",
    completion_time: 4,
    is_saved_to_cloud: true,
  },
];

const INPUT_FIELD_STYLE =
  "h-10 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap border-muted/60 text-sm focus:border-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 sm:w-48";
const TestSequencerView = () => {
  const [deviceId, setDeviceID] = useState("");
  const [testRunTag, setTestRunTag] = useState("");
  return (
    <div className="flex flex-col space-y-5">
      {/* New Test Form */}
      <div className="flex flex-row space-x-5">
        <Input
          className={INPUT_FIELD_STYLE}
          value={deviceId}
          onChange={(e) => setDeviceID(e.target.value)}
          placeholder="Device ID (optional)"
          disabled={IS_CLOUD_DEMO}
        />
        <Input
          className={INPUT_FIELD_STYLE}
          value={testRunTag}
          onChange={(e) => setTestRunTag(e.target.value)}
          placeholder="Test Run Tag (optional)"
          disabled={IS_CLOUD_DEMO}
        />
        <Button>New Test</Button>
      </div>
      <DataTable data={data} />
      <SummaryTable data={data} />
    </div>
  );
};

export default TestSequencerView;
