import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
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
import {
  useDisplayedSequenceState,
  useSequencerState,
} from "@/renderer/hooks/useTestSequencerState";
import { parseInt, map } from "lodash";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import LockableButton from "@/renderer/routes/test_sequencer_panel/components/lockable/LockedButtons";
import { useRef, useState } from "react";
import { DraggableRowSequence } from "@/renderer/routes/test_sequencer_panel/components/dnd/DraggableRowSequence";
import { getCompletionTime, getSuccessRate, mapStatusToDisplay } from "./utils";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useImportSequences } from "@/renderer/hooks/useTestSequencerProject";
import { useSequencerModalStore } from "@/renderer/stores/modal";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";
import { RenameModal } from "../modals/RenameModal";
import { toast } from "sonner";

export function SequenceTable() {
  const { project, isLocked } = useDisplayedSequenceState();
  const { sequences, setSequences } = useSequencerState();
  const removeSequence = useSequencerStore(
    useShallow((state) => state.removeSequence),
  );
  const { setIsCreateProjectModalOpen } = useSequencerModalStore();
  const importSequences = useImportSequences();
  const { isAdmin } = useWithPermission();

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
        return <div>{row.original.project.name}</div>;
      },
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return <div>{row.original.project.description}</div>;
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
            checked={row.original.runable}
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
      accessorKey: "success_rate",
      header: "Success Rate",
      cell: ({ row }) => {
        return (
          <div>
            <p className="text-primary">
              {getSuccessRate(row.original.elements).toFixed(2)}%
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "completion_time",
      header: "Completion Time",
      cell: ({ row }) => {
        const time = getCompletionTime(row.original.elements);
        return (
          <div>
            <p className="text-primary"> {time.toFixed(2)}s </p>
          </div>
        );
      },
    },

    {
      accessorKey: "up-down",
      header: () => <div className="text-center">Reorder</div>,
      cell: ({ row }) => {
        const onUpClick = () => {
          setRowSelection([]);
          const newSequences = [...sequences];
          const index = parseInt(row.id);
          if (index == 0) return;
          newSequences[index] = sequences[index - 1];
          newSequences[index - 1] = sequences[index];
          setSequences(newSequences);
        };
        const onDownClick = () => {
          setRowSelection([]);
          const newSequences = [...sequences];
          const index = parseInt(row.id);
          if (index == 0) return;
          newSequences[index] = sequences[index + 1];
          newSequences[index + 1] = sequences[index];
          setSequences(newSequences);
        };
        return (
          <div className="relative z-20 flex flex-row justify-center">
            <LockableButton variant="ghost">
              <ChevronUpIcon onClick={onUpClick} />
            </LockableButton>
            <LockableButton variant="ghost">
              <ChevronDownIcon onClick={onDownClick} />
            </LockableButton>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "up-down": false,
    selected: isAdmin(),
  });
  const [rowSelection, setRowSelection] = useState({});

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
    onRemoveSequence(
      map(Object.keys(rowSelection), (idxStr) => parseInt(idxStr)),
    );
    setRowSelection([]);
  };

  const onRemoveSequence = (idxs: number[]) => {
    const isUnsaved = sequences.some(
      (sequence, idx) => idxs.includes(idx) && sequence.testSequenceUnsaved,
    );
    if (isUnsaved) {
      const shouldContinue = window.confirm(
        "You have unsaved changes. Do you want to continue?",
      );
      if (!shouldContinue) return;
    }
    const seqNames = sequences
      .filter((_, idx) => idxs.includes(idx))
      .map((seq) => seq.project.name);
    seqNames.forEach((name) => removeSequence(name));
  };

  const onToggleSequence = (idxs: number[]) => {
    setSequences.withException(
      [...sequences].map((sequence, idx) => {
        if (idxs.includes(idx)) {
          return { ...sequence, runable: !sequence.runable };
        }
        return sequence;
      }),
    );
  };

  const onRenameSequence = (idx: number) => {
    const sequence = sequences[idx];
    renameForIdx.current = idx;
    setRenameTarget(sequence.project.name);
    setInitialName(sequence.project.name);
    setIsRenameNameModalOpen(true);
  };

  const handleRenameSequence = (newName: string) => {
    // make sure the new name is unique
    if (sequences.some((seq) => seq.project.name === newName)) {
      toast.error("Sequence name must be unique");
      return;
    }
    setSequences(
      [...sequences].map((seq, idx) => {
      if (idx === renameForIdx.current) {
        return {
          ...seq,
          project: { ...seq.project, name: newName },
          testSequenceUnsaved: true,
        };
      }
      return seq;
      }),
    );
    setIsRenameNameModalOpen(false);
  }
  const [isRenameNameModalOpen, setIsRenameNameModalOpen] = useState(false);
  const [isRenameDescModalOpen, setIsRenameDescModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState("");
  const [initialName, setInitialName] = useState("");
  const renameForIdx = useRef(-1);
  
  const onRenameDescription = (idx: number) => {
    const sequence = sequences[idx];
    renameForIdx.current = idx;
    setRenameTarget(sequence.project.name);
    setInitialName(sequence.project.description);
    setIsRenameDescModalOpen(true);
  };

  const handleRenameDescription = (newDescription: string) => {
    setSequences(
      [...sequences].map((seq, idx) => {
      if (idx === renameForIdx.current) {
      return {
        ...seq,
        project: { ...seq.project, description: newDescription },
        testSequenceUnsaved: true,
      };
      }
      return seq;
      }),
    );
    setIsRenameDescModalOpen(false);
  }

  return (
    <div className="flex flex-col">
      <RenameModal 
        title="Rename sequence"
        isModalOpen={isRenameNameModalOpen}
        setModalOpen={setIsRenameNameModalOpen}
        initialName={initialName}
        handleSubmit={handleRenameSequence}
        target={renameTarget}
      />
      <RenameModal 
        title="Edit description"
        isModalOpen={isRenameDescModalOpen}
        setModalOpen={setIsRenameDescModalOpen}
        initialName={initialName}
        handleSubmit={handleRenameDescription}
        target={renameTarget}
      />
      <div className="m-1 flex items-center py-0">
        {isAdmin() ? (
          <LockableButton
            disabled={Object.keys(rowSelection).length == 0}
            onClick={handleClickRemoveSequence}
            variant="ghost"
            className="gap-2 whitespace-nowrap p-2"
          >
            <TrashIcon size={20} />
            <div className="hidden sm:block">Remove selected items</div>
          </LockableButton>
        ) : (
          <div />
        )}
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
                      isSelected={
                        project !== null &&
                        project.name === row.original.project.name
                      }
                      data-state={row.getIsSelected() && "selected"}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => {
                        onRenameSequence(row.index);
                      }}
                    >
                      Rename sequence
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        onRenameDescription(row.index);
                      }}
                    >
                      Edit description
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => {
                        onRemoveSequence([row.index]);
                      }}
                    >
                      Remove sequence
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 cursor-pointer text-center hover:underline"
                  onClick={() => {
                    if (isAdmin()) {
                      setIsCreateProjectModalOpen(true);
                    } else {
                      importSequences();
                    }
                  }}
                >
                  No Sequence
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
