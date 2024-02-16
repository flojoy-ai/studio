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
import { filter, max, sum } from "lodash";
import {
  Summary,
  Test,
  TestSequenceElement,
} from "@/renderer/types/testSequencer";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useEffect, useState } from "react";

const getOnlyTests = (data: TestSequenceElement[]): Test[] => {
  return filter(
    data,
    (elem) => elem.type === "test" && elem.status != "pending",
  ) as Test[];
};

const getCompletionTime = (data: TestSequenceElement[]) => {
  const onlyTests = getOnlyTests(data);
  const parallel = filter(onlyTests, (elem) => elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  const nonParallel = filter(onlyTests, (elem) => !elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  let maxParallel = parallel.length > 0 ? max(parallel) : 0;
  if (maxParallel === undefined) maxParallel = 0;
  const nonParallelTotal = sum(nonParallel);
  return maxParallel + nonParallelTotal;
};

const getSuccessRate = (data: TestSequenceElement[]): number => {
  const tests = getOnlyTests(data);
  if (tests.length == 0) return 0;
  return (
    (filter(tests, (elem) => elem.status == "pass").length / tests.length) * 100
  );
};

const columns: ColumnDef<Summary>[] = [
  {
    accessorKey: "id",
    header:  <h2 className="mb-2 text-lg font-bold text-accent1 pt-2"> Test Sequencer </h2>,
    cell: () => <div>Summary:</div>,
  },
  {
    accessorKey: "success_rate",
    header: "Success Rate",
    cell: ({ row }) => {
      return <div>{row.original.successRate.toFixed(1)}%</div>;
    },
  },
  {
    accessorKey: "completion_time",
    header: "Total time",
    cell: ({ row }) => {
      return <div>{row.original.completionTime.toFixed(2)}s</div>;
    },
  },
];

export function SummaryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { elems } = useTestSequencerState();
  const [summary, setSummary] = useState<Summary[]>([]);
  useEffect(() => {
    setSummary([
      {
        id: "1",
        successRate: getSuccessRate(elems),
        completionTime: getCompletionTime(elems),
      },
    ]);
  }, [elems]);

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
    <div className="flex flex-col">
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
