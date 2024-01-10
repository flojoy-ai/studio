import { v4 as uuidv4 } from "uuid";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TestSequenceElement,
  CONDITIONAL_TYPES,
} from "@src/types/testSequencer";
import { useTestSequencerState } from "@src/hooks/useTestSequencerState";
import { parseInt, filter } from "lodash";
import { AddConditionalModal } from "./AddConditionalModal";

export function DataTable() {
  const { elems, setElements } = useTestSequencerState();

  const columns: ColumnDef<TestSequenceElement>[] = [
    {
      id: "selected",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "test_name",
      header: "Test name",
      cell: ({ row }) => <div>{row.getValue("test_name")}</div>,
    },
    {
      accessorKey: "run_in_parallel",
      header: "Run in parallel",
      cell: ({ row }) => {
        return row.getValue("run_in_parallel") ? <div>✅</div> : <div>No</div>;
      },
    },
    {
      accessorKey: "test_type",
      header: "Test type",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("test_type")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <div>{row.getValue("status")}</div>;
      },
    },
    {
      accessorKey: "completion_time",
      header: "Time complete",
      enableHiding: false,
      cell: ({ row }) => {
        return <div>{parseFloat(row.getValue("completion_time"))}s</div>;
      },
    },
    {
      accessorKey: "is_saved_to_cloud",
      header: "Saved to Flojoy Cloud",
      enableHiding: false,
      cell: ({ row }) => {
        return row.getValue("is_saved_to_cloud") ? (
          <Button>OPEN TEST</Button>
        ) : null;
      },
    },
    {
      accessorKey: "up-down",
      header: "Reorder",
      enableHiding: false,
      cell: ({ row }) => {
        const onUpClick = () => {
          setElements((data) => {
            const new_data = [...data];
            const index = parseInt(row.id);
            if (index == 0) return data;
            new_data[index] = data[index - 1];
            new_data[index - 1] = data[index];
            return new_data;
          });
        };
        const onDownClick = () => {
          setElements((data) => {
            const new_data = [...data];
            const index = parseInt(row.id);
            if (index == data.length) return data;
            new_data[index] = data[index + 1];
            new_data[index + 1] = data[index];
            return new_data;
          });
        };
        return (
          <div className="flex flex-row">
            <Button onClick={onUpClick}>UP</Button>
            <Button onClick={onDownClick}>DOWN</Button>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const data = elems; // this is necessary for some reason for the table to work no idea why

  const onRemoveTest = (testIdx: number) => {
    console.log("lol", testIdx);
    setElements((data) => {
      return filter(data, (_, idx) => idx != testIdx);
    });
  };

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

  const [showAddConditionalModal, setShowAddConditionalModal] =
    React.useState(false);
  const addConditionalAfterIdx = React.useRef(-1);

  const handleAddConditionalModal = (type: CONDITIONAL_TYPES) => {
    setElements((data) => {
      const new_data = [...data];
      return new_data.splice(addConditionalAfterIdx.current, 0, {
        id: uuidv4(), // generate id
        type: type,
        condition: "",
      });
    });
  };

  const handleClickAddConditional = (idx: number) => {
    addConditionalAfterIdx.current = idx;
    setShowAddConditionalModal(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-0">
        <AddConditionalModal
          isConditionalModalOpen={showAddConditionalModal}
          handleAddConditionalModalOpen={setShowAddConditionalModal}
          handleAdd={handleAddConditionalModal}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                    <ContextMenu>
                      <TableCell key={cell.id}>
                        <ContextMenuTrigger>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </ContextMenuTrigger>
                      </TableCell>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onClick={() =>
                            handleClickAddConditional(parseInt(row.id))
                          }
                        >
                          Add Conditional
                        </ContextMenuItem>
                        <ContextMenuItem>Show Output Plot</ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => onRemoveTest(parseInt(row.id))}
                        >
                          Remove Test
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
