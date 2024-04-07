import { useSequencerModalStore } from "@/renderer/stores/modal";
import { useSequencerTestState } from "@/renderer/hooks/useTestSequencerState";
import { filter } from "lodash";
import { Button } from "@/renderer/components/ui/button";
import { ACTIONS_HEIGHT } from "@/renderer/routes/common/Layout";
import { FlaskConical, Import, LayoutGrid, Plus, Route } from "lucide-react";
import {
  StatusType,
  Test,
  TestSequenceContainer,
  TestSequenceElement,
} from "@/renderer/types/test-sequencer";
import { useMemo, useState } from "react";
import { getOnlyCompletedTests } from "./data-table/utils";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import { useImportSequences } from "@/renderer/hooks/useTestSequencerProject";
import { CyclePanel } from "./CyclePanel";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";

export type Summary = {
  successRate: number;
  numberOfTestRun: number;
  numberOfTest: number;
  numberOfSequenceRun: number;
  numberOfSequence: number;
  status: StatusType;
};

export function DesignBar() {
  const { setIsImportTestModalOpen, setIsCreateProjectModalOpen } =
    useSequencerModalStore();
  const { elems } = useSequencerTestState();
  const { sequences, cycleRuns } = useSequencerStore(
    useShallow((state) => ({
      sequences: state.sequences,
      cycleRuns: state.cycleRuns,
    })),
  );
  const { isAdmin } = useWithPermission();
  const importSequences = useImportSequences();

  const [summary, setSummary] = useState<Summary>({
    numberOfTestRun: 0,
    numberOfTest: 0,
    numberOfSequenceRun: 0,
    numberOfSequence: 0,
    successRate: 0,
    status: "pending",
  });
  useMemo(() => {
    setSummary({
      numberOfTestRun: getNumberOfTestRun(elems),
      numberOfTest: getNumberOfTest(elems),
      numberOfSequence: getNumberOfSequence(sequences),
      numberOfSequenceRun: getNumberOfSequenceRun(sequences),
      successRate: getSuccessRate(elems),
      status: getGlobalStatus(cycleRuns, sequences, elems),
    });
  }, [elems, sequences, cycleRuns]);

  return (
    <div className=" border-b" style={{ height: ACTIONS_HEIGHT }}>
      <div className="py-1" />
      <div className="flex">
        {isAdmin() && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                className="gap-2"
                variant="ghost"
                data-testid="new-dropdown"
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
                data-testid="import-test-button"
              >
                <FlaskConical
                  size={16}
                  className="mr-2 stroke-muted-foreground"
                />
                New Test
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsCreateProjectModalOpen(true);
                }}
              >
                <Route size={16} className="mr-2 stroke-muted-foreground" />
                New Sequence
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  importSequences();
                }}
              >
                <Import size={16} className="mr-2 stroke-muted-foreground" />
                Import Sequence
              </DropdownMenuItem>
              <DropdownMenuItem disabled={true}>
                <LayoutGrid
                  size={16}
                  className="mr-2 stroke-muted-foreground"
                />
                Sequence Gallery
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* Comming soon
        <Button
          data-testid="add-text-button"
          className="gap-2"
          variant="ghost"
          disabled={true}
        >
          <HardDriveDownload size={20} className="stroke-muted-foreground" />
          Load Test Profile From Cloud
        </Button>
        */}

        <div className="grow" />

        <code className="inline-flex items-center justify-center p-3 text-sm text-muted-foreground">
          {" "}
          Test {summary.numberOfTestRun + "/" + summary.numberOfTest}
        </code>
        <code className="inline-flex items-center justify-center p-3 text-sm text-muted-foreground">
          {" "}
          Sequence{" "}
          {summary.numberOfSequenceRun + "/" + summary.numberOfSequence}
        </code>

        <CyclePanel />

        <div
          data-cy="app-status"
          id="app-status"
          className="text-md m-1 inline-flex h-8 w-40 items-center justify-center rounded-md border font-semibold text-primary transition-colors"
        >
          {mapStatusToDisplay[summary.status]}
        </div>
      </div>
      <div className="py-1" />
    </div>
  );
}

// Helper functions
export function countWhere<T>(arr: T[], predicate: (t: T) => boolean): number {
  return arr.reduce((acc, t) => (predicate(t) ? acc + 1 : acc), 0);
}

const getNumberOfTest = (data: TestSequenceElement[]): number => {
  return countWhere(data, (elem) => elem.type === "test");
};

const getNumberOfTestRun = (data: TestSequenceElement[]): number => {
  return countWhere(
    data,
    (elem) =>
      elem.type === "test" &&
      elem.status != "pending" &&
      elem.status != "running",
  );
};

const getNumberOfSequence = (data: TestSequenceContainer[]): number => {
  return countWhere(data, (elem) => elem.runable);
};

const getNumberOfSequenceRun = (data: TestSequenceContainer[]): number => {
  return countWhere(
    data,
    (elem) =>
      elem.runable && elem.status != "pending" && elem.status != "running",
  );
};

export const getGlobalStatus = (
  cycleRuns: TestSequenceContainer[][],
  sequences: TestSequenceContainer[],
  data: TestSequenceElement[],
): StatusType => {
  // Create a priority list with all the status
  interface WithStatus {
    status: string;
  }
  const priority = {
    pending: 0,
    pass: 1,
    fail: 2,
    aborted: 3,
    paused: 4,
    running: 5,
  };
  // Find highest priority in cycle
  const highestCycle =
    cycleRuns.length > 0
      ? cycleRuns
          .map((el) => getGlobalStatus([], el, []))
          .reduce((prev, curr) =>
            priority[prev] > priority[curr] ? prev : curr,
          )
      : "pending";
  if (sequences.length === 0 && data.length === 0) return highestCycle;
  // Highest in the view
  const tests = data.filter((el) => el.type === "test") as Test[];
  const iter = sequences.length > 0 ? sequences : tests;
  const status = iter
    .map((el: WithStatus) => el.status)
    .reduce((prev, curr) => (priority[prev] > priority[curr] ? prev : curr));
  const highestGlobal =
    priority[highestCycle] > priority[status] ? highestCycle : status;
  return StatusType.parse(highestGlobal);
};

const mapStatusToDisplay: { [k in StatusType] } = {
  pending: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-secondary text-primary">
      <code data-testid="global-status-badge">PENDING</code>
    </div>
  ),
  running: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-blue-500 text-primary-foreground">
      <code data-testid="global-status-badge">RUNNING</code>
    </div>
  ),
  paused: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
      <code data-testid="global-status-badge">PAUSED</code>
    </div>
  ),
  pass: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-green-500 text-primary-foreground">
      <code data-testid="global-status-badge">PASS</code>
    </div>
  ),
  aborted: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-red-500 text-primary-foreground">
      <code data-testid="global-status-badge">ABORTED</code>
    </div>
  ),
  fail: (
    <div className="inline-flex h-full w-full items-center justify-center rounded-md bg-red-500 text-primary-foreground">
      <code data-testid="global-status-badge">FAIL</code>
    </div>
  ),
};

const getSuccessRate = (data: TestSequenceElement[]): number => {
  const tests = getOnlyCompletedTests(data);
  if (tests.length == 0) return 0;
  return (
    (filter(tests, (elem) => elem.status == "pass").length / tests.length) * 100
  );
};
