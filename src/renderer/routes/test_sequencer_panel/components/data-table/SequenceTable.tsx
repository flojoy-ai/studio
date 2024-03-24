import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/renderer/components/ui/context-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/renderer/components/ui/button";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { TestSequenceContainer } from "@/renderer/types/test-sequencer";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { parseInt, map } from "lodash";
import { ChevronDownIcon, TrashIcon } from "lucide-react";
import LockableButton from "@/renderer/routes/test_sequencer_panel/components/lockable/LockedButtons";
import { useState } from "react";
import { DraggableRowSequence } from "../dnd/DraggableRowSequence";
import { mapStatusToDisplay } from "./utils";


export function SequenceTable() {

  const columns: ColumnDef<TestSequenceContainer>[] = [
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
          className="relative z-20"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "name",
      header: "Sequence name",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.project.name}
          </div>
        );
      },
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.project.description}
          </div>
        )
      },
    },

    {
      accessorKey: "run",
      header: "Run",
      cell: ({ row }) => {
        return (
          <Checkbox
            disabled={isLocked}
            className="relative z-20"
            checked={row.original.run}
            onCheckedChange={() => onToggleSequence([row.index])}
            aria-label="Select row"
          />
        );
      },
    },


    {
      accessorKey: "status",
      header: "Status",
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
      accessorKey: "completion_time",
      header: "Completion Time",
      cell: ({ row }) => {
        let time = 0;
        row.original.elements.forEach((element) => {
          if (element.type === "test" && element.completionTime) {
            time += element.completionTime;
          }
        });
        return (
          <div>
            <p className="text-primary"> {time.toFixed(2)}s </p>
          </div>
        )
      },
    },

  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { sequences, setSequences, setSequenceAsRunnable, project, isLocked } = useTestSequencerState();

  const data = sequences;

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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

  const handleClickRemoveSequence = () => {
    onRemoveSequence(map(Object.keys(rowSelection), (idxStr) => parseInt(idxStr)));
    setRowSelection([]);
  };

  const onRemoveSequence = (idxs: number[]) => {
    setSequences([ ...sequences].filter((_, idx) => !idxs.includes(idx)));
  };

  const onToggleSequence = (idxs: number[]) => {
    // TODO: Integrity
    setSequences.withException([ ...sequences].map((sequence, idx) => {
      if (idxs.includes(idx)) {
        return { ...sequence, run: !sequence.run };
      }
      return sequence;
    }));
  };

  return (
    <div className="flex flex-col">
      <div className="m-1 flex items-center py-0">
        <LockableButton
          disabled={Object.keys(rowSelection).length == 0}
          onClick={handleClickRemoveSequence}
          variant="ghost"
          className="gap-2 whitespace-nowrap p-2"
        >
          <TrashIcon size={20} />
          <div className="hidden sm:block">Remove selected items</div>
        </LockableButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-auto">
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
                <TableHeader key={"drag&drop"} />
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
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <DraggableRowSequence
                      row={row}
                      key={row.id}
                      isSelected={project !== null && project.name === row.original.project.name}
                      data-state={row.getIsSelected() && "selected"}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => { onRemoveSequence([row.index]); }}
                    >
                      Remove Sequence
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => { onToggleSequence([row.index]); }}
                    >
                      { row.original.run ? "Disable" : "Enable" }
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No Sequence.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
