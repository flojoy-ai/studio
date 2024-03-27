import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { filter} from "lodash";
import {
  CycleConfig,
  StatusType,
  Summary,
  TestSequenceContainer,
  TestSequenceElement,
} from "@/renderer/types/test-sequencer";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect, useState } from "react";
import { getOnlyTests } from "./utils";
import { Badge } from "@/renderer/components/ui/badge";
import { mapStatusToDisplay } from "./utils";


const getSuccessRate = (data: TestSequenceElement[]): number => {
  const tests = getOnlyTests(data);
  if (tests.length == 0) return 0;
  return (
    (filter(tests, (elem) => elem.status == "pass").length / tests.length) * 100
  );
};

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
    if (elem.type === "test" && elem.status != "pending") count++;
  });
  return count;
}

const getNumberOfCycleRun = (cycle: CycleConfig): string => {
  if (cycle.infinite) {
    return (cycle.ptrCycle + 1) + "/∞";
  }
  return (cycle.ptrCycle + 1) + "/" + cycle.cycleCount;
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

const columns: ColumnDef<Summary>[] = [

  {
    accessorKey: "id",
    header: () => (
      <h2 className="mb-2 pt-2 text-lg font-bold text-accent1">
         Status
      </h2>
    ),
    cell: () => <div>Summary:</div>,
  },
  {
    accessorKey: "status",
    header: "Sequencer Status",
    cell: ({ row }) => {
      return (
        <div>
          {typeof mapStatusToDisplay[row.original.status] === "function"
            ? mapStatusToDisplay[row.original.status](null)
            : mapStatusToDisplay[row.original.status]}
        </div>
      );
    },
  },
  {
    accessorKey: "nb_cycle_run",
    header: "Cycle Run",
    cell: ({ row }) => {
      return <div>{row.original.numberOfCycleRunDisplay}</div>;
    },
  },
  {
    accessorKey: "cycleStatus",
    header: "Cycle Status",
    cell: ({ row }) => {
      return (
        <div>
          {typeof mapStatusToDisplay[row.original.status] === "function"
            ? mapStatusToDisplay[row.original.status](null)
            : mapStatusToDisplay[row.original.status]}
        </div>
      );
    }
  },
  {
    accessorKey: "nb_test_run",
    header: "Tests Run",
    cell: ({ row }) => {
      return <div>{row.original.numberOfTestRun + "/" + row.original.numberOfTest}</div>;
    },
  },
  {
    accessorKey: "success_rate",
    header: "Success Rate",
    cell: ({ row }) => {
      return <div>{row.original.successRate.toFixed(1)}%</div>;
    },
  },
];

export function SummaryTable() {
  const { elems, cycleConfig, sequences, cycleRuns } = useTestSequencerState();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "cycleStatus": cycleRuns.length > 1, 
    "nb_cycle_run": cycleConfig.cycleCount > 1 || cycleConfig.infinite,
  })
  const [rowSelection, setRowSelection] = useState({});
  const [summary, setSummary] = useState<Summary[]>([]);
  useEffect(() => {
    setColumnVisibility({
      "cycleStatus": cycleRuns.length > 1,
      "nb_cycle_run": cycleConfig.cycleCount > 1 || cycleConfig.infinite,
    });
    setSummary([
      {
        id: "1",
        numberOfTestRun: getNumberOfTestRun(elems),
        numberOfTest: getNumberOfTest(elems),
        successRate: getSuccessRate(elems),
        numberOfCycleRunDisplay: getNumberOfCycleRun(cycleConfig),
        status: getGlobalStatus(cycleRuns, sequences, elems),
      },
    ]);
  }, [elems, cycleConfig, sequences, cycleRuns]);

  const data = summary;
  const summaryTable = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {summaryTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {summaryTable.getRowModel().rows?.length ? (
              summaryTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
