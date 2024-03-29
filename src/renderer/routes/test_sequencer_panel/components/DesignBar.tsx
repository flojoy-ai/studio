import { useModalStore } from "@/renderer/stores/modal";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _, { filter } from "lodash";
import { Button } from "@/renderer/components/ui/button";
import { ACTIONS_HEIGHT } from "../../common/Layout";
import { FlaskConical, HardDriveDownload, Import, LayoutGrid, Plus, Route } from "lucide-react";
import { StatusType, TestSequenceContainer, TestSequenceElement } from "@/renderer/types/test-sequencer";
import { useEffect, useState } from "react";
import { getOnlyTests } from "./data-table/utils";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/renderer/components/ui/dropdown-menu";
import { useImportSequences } from "@/renderer/hooks/useTestSequencerProject";
import { CyclePanel } from "./CyclePanel";

export type Summary = {
  successRate: number;
  numberOfTestRun: number;
  numberOfTest: number;
  numberOfSequenceRun: number;
  numberOfSequence: number;
  status: StatusType;
};


export function DesignBar() {
  const { setIsImportTestModalOpen, setIsCreateProjectModalOpen } = useModalStore();
  const { elems, sequences, cycleRuns } = useTestSequencerState();
  const { isAdmin } = useWithPermission();
  const importSequences = useImportSequences();

  const [summary, setSummary] = useState<Summary>(
    {
      numberOfTestRun: 0,
      numberOfTest: 0,
      numberOfSequenceRun: 0,
      numberOfSequence: 0,
      successRate: 0,
      status: "pending",
    }
  );
  useEffect(() => {
    setSummary(
      {
        numberOfTestRun: getNumberOfTestRun(elems),
        numberOfTest: getNumberOfTest(elems),
        numberOfSequence: getNumberOfSequence(sequences),
        numberOfSequenceRun: getNumberOfSequenceRun(sequences),
        successRate: getSuccessRate(elems),
        status: getGlobalStatus(cycleRuns, sequences, elems),
      },
    );
  }, [elems, sequences, cycleRuns]);

  return (
    <div className=" border-b" style={{ height: ACTIONS_HEIGHT }}>
      <div className="py-1" />
      <div className="flex">
        { isAdmin() && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                data-testid="add-text-button"
                className="gap-2"
                variant="ghost"
              >
                <Plus size={20} className="stroke-muted-foreground" />
                New 
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-12">
              <DropdownMenuItem
                onClick={() => {
                  setIsImportTestModalOpen(true);
                }}
              >
                <FlaskConical size={16} className="stroke-muted-foreground mr-2" />
                New Test
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsCreateProjectModalOpen(true);
                }}
              >
                <Route size={16} className="stroke-muted-foreground mr-2" />
                New Sequence
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  importSequences();
                }}
              >
                <Import size={16} className="stroke-muted-foreground mr-2" />
                Import Sequence
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={true}
              >
                <LayoutGrid size={16} className="stroke-muted-foreground mr-2" />
                Sequence Gallery
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          data-testid="add-text-button"
          className="gap-2"
          variant="ghost"
          disabled={true}
        >
          <HardDriveDownload size={20} className="stroke-muted-foreground" />
          Load Test Profile From Cloud
        </Button>

        <div className="grow" />

        <code
          className="inline-flex items-center justify-center text-muted-foreground p-3 text-sm"
        > Test {summary.numberOfTestRun + "/" + summary.numberOfTest}</code>
        <code
          className="inline-flex items-center justify-center text-muted-foreground p-3 text-sm"
        > Sequence {summary.numberOfSequenceRun + "/" + summary.numberOfSequence}</code>

        <CyclePanel/>

        <div
          data-cy="app-status"
          id="app-status"
          className="inline-flex items-center justify-center rounded-md border font-semibold transition-colors text-primary h-8 w-40 text-md m-1"
        >
          {mapStatusToDisplay[summary.status]}
        </div>
      </div>
      <div className="py-1" />
    </div>
  );
}

// Helper functions

const getNumberOfTest = (data: TestSequenceElement[]): number => {
  let count = 0;
  data.forEach((elem) => {
    if (elem.type === "test") count++;
  });
  return count;
}

const getNumberOfTestRun = (data: TestSequenceElement[]): number => {
  let count = 0;
  data.forEach((elem) => {
    if (elem.type === "test" && elem.status != "pending" && elem.status != "running") count++;
  });
  return count;
}

const getNumberOfSequence = (data: TestSequenceContainer[]): number => {
  let count = 0;
  data.forEach((elem) => {
    if (elem.runable) count++;
  });
  return count;
}

const getNumberOfSequenceRun = (data: TestSequenceContainer[]): number => {
  let count = 0;
  data.forEach((elem) => {
    if (elem.runable && elem.status != "pending" && elem.status != "running") count++;
  });
  return count;
}

const getGlobalStatus = (cycleRuns: TestSequenceContainer[][],  sequences: TestSequenceContainer[], data: TestSequenceElement[]): StatusType => {
  // Create a priority list with all the status
  const priority = { "pending": 0, "pass": 1, "fail": 2, "aborted": 3, "paused": 4, "running": 5 };
  // Find highest priority in cycle
  const highestCycle = cycleRuns.length > 0 ?
    cycleRuns.map((el) => getGlobalStatus([], el, [])).reduce((prev, curr) => priority[prev] > priority[curr] ? prev : curr) :
    "pending";
  if (sequences.length === 0 && data.length === 0) return highestCycle;
  // Highest in the view
  const iter = sequences.length > 0 ? sequences : data;
  const status = iter.map((el) => el.status).reduce((prev, curr) => priority[prev] > priority[curr] ? prev : curr);
  const highestGlobal = priority[highestCycle] > priority[status] ? highestCycle : status;
  return highestGlobal ;
}

const mapStatusToDisplay: { [k in StatusType] } = {
  "pending": <div className="bg-secondary rounded-md h-full w-full inline-flex items-center justify-center text-primary"><code>PENDING</code></div>,
  "running": <div className="bg-blue-500 rounded-md h-full w-full inline-flex items-center justify-center text-primary-foreground"><code>RUNNING</code></div>,
  "paused": <div className="bg-yellow-500 rounded-md h-full w-full inline-flex items-center justify-center text-primary-foreground"><code>PAUSED</code></div>,
  "pass": <div className="bg-green-500 rounded-md h-full w-full inline-flex items-center justify-center text-primary-foreground"><code>PASS</code></div>,
  "aborted": <div className="bg-red-500 rounded-md h-full w-full inline-flex items-center justify-center text-primary-foreground"><code>ABORTED</code></div>,
  "fail": <div className="bg-red-500 rounded-md h-full w-full inline-flex items-center justify-center text-primary-foreground"><code>FAIL</code></div>,
}

const getSuccessRate = (data: TestSequenceElement[]): number => {
  const tests = getOnlyTests(data);
  if (tests.length == 0) return 0;
  return (
    (filter(tests, (elem) => elem.status == "pass").length / tests.length) * 100
  );
};
