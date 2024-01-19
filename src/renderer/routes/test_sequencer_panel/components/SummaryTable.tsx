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
} from "@/components/ui/table";
import { filter, max, sum } from "lodash";
import { Summary, Test, TestSequenceElement } from "@src/types/testSequencer";
import { useTestSequencerState } from "@src/hooks/useTestSequencerState";

const getOnlyTests = (data: TestSequenceElement[]): Test[] => {
  return filter(data, (elem) => elem.type === "test");
};

const getCompletionTime = (data: TestSequenceElement[]) => {
  const onlyTests = getOnlyTests(data);
  const parallel = filter(onlyTests, (elem) => elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  const non_parallel = filter(onlyTests, (elem) => !elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  let max_p = max(parallel);
  let sum_np = sum(non_parallel);
  if (!max_p) max_p = 0;
  if (!sum_np) sum_np = 0;
  return max_p + sum_np;
};

const getSuccessRate = (data: TestSequenceElement[]): number => {
  const tests = getOnlyTests(data);
  return filter(tests, (elem) => elem.status == "pass").length / tests.length;
};

export function SummaryTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { elems } = useTestSequencerState();
  const [summary, setSummary] = React.useState<Summary[]>([]);

  React.useEffect(() => {
    setSummary([
      {
        id: "1",
        successRate: getSuccessRate(elems),
        completionTime: getCompletionTime(elems),
      },
    ]);
  }, [elems]);

  const columns: ColumnDef<Summary>[] = [
    {
      accessorKey: "id",
      header: "",
      cell: () => <div>Summary:</div>,
    },
    {
      accessorKey: "success_rate",
      header: "Success Rate",
      cell: ({ row }) => {
        return <div>{row.getValue("success_rate")}%</div>;
      },
    },
    {
      accessorKey: "completion_time",
      header: "Total time",
      cell: ({ row }) => {
        return <div>{row.getValue("completion_time")}s</div>;
      },
    },
  ];

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
    <div className="w-full">
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
