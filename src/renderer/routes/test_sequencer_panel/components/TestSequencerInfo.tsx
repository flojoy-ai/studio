import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { IS_CLOUD_DEMO } from "@src/data/constants";
import { useState } from "react";
import { DataTable } from "./DataTable";

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
      <DataTable />
    </div>
  );
};

export default TestSequencerView;
