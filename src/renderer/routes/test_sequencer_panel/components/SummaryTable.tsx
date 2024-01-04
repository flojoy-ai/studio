import * as React from "react";
import { filter, max, sum } from "lodash";
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
import { Test } from "./TestSequencerInfo";

const getCompletionTime = (data: Test[]) => {
  const parallel = filter(data, (elem) => elem.run_in_parallel).map(
    (elem) => elem.completion_time,
  );
  const non_parallel = filter(data, (elem) => !elem.run_in_parallel).map(
    (elem) => elem.completion_time,
  );
  let max_p = max(parallel);
  let sum_np = sum(non_parallel);
  if (!max_p) max_p = 0;
  if (!sum_np) sum_np = 0;
  return max_p + sum_np;
};

const getSuccessRate = (data: Test[]) => {
  return filter(data, (elem) => elem.status == "pass").length / data.length;
};

export function SummaryTable({ data }: { data: Test[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [summary, setSummary] = useState([
    {
      success_rate: getSuccessRate(data),
      completion_time: getCompletionTime(data),
    },
  ]);

  const columns: ColumnDef<Test>[] = [
    {
      id: "summary",
      header: "",
      cell: () => <div>Summary:</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "success_rate",
      header: "Success Rate",
      cell: () => {
        return <div>{getSuccessRate(data)}%</div>;
      },
    },
    {
      accessorKey: "completion_time",
      header: "Total time",
      enableHiding: false,
      cell: () => {
        return <div>{getCompletionTime(data)}s</div>;
      },
    },
  ];

  const table = useReactTable({
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
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
