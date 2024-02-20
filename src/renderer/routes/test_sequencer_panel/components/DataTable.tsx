import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/renderer/components/ui/context-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
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
import {
  TestSequenceElement,
  ConditionalComponent,
  Conditional,
  Test,
  StatusTypes,
} from "@/renderer/types/testSequencer";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { parseInt, filter, map } from "lodash";
import { AddConditionalModal } from "./AddConditionalModal";
import {
  generateConditional,
  getIndentLevels,
} from "../utils/ConditionalUtils";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  Loader,
  TrashIcon,
} from "lucide-react";
import { WriteConditionalModal } from "./AddWriteConditionalModal";
import LockableButton from "./lockable/LockedButtons";
import { useRef, useState, useEffect } from "react";

const IndentLine = ({
  content: name,
  level = 0,
}: {
  content: React.ReactNode;
  level: number;
}) => (
  <div className="flex h-full flex-row">
    {level == 0 ? (
      name
    ) : (
      <div className="flex flex-row">
        <div className={"mr-5 flex h-full border-l-2 border-blue-800"}></div>
        <IndentLine content={name} level={level - 1} />
      </div>
    )}
  </div>
);

const mapStatusToDisplay: { [k in StatusTypes]: React.ReactNode } = {
  pass: <p className="text-green-500">PASS</p>,
  failed: <p className="text-red-500">FAIL</p>,
  pending: <p className="text-yellow-500">PENDING</p>,
};

export function DataTable() {
  const { elems, setElems, running } = useTestSequencerState();
  const [addIfStatement, _setAddIfStatement] = useState(false);
  const indentLevels = getIndentLevels(elems);

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
      accessorFn: (elem) => {
        return elem.type === "test" ? "testName" : "conditionalType";
      },
      header: "Test name",
      cell: ({ row }) => {
        const isTest = row.original.type === "test";
        return isTest ? (
          <div className="flex h-full space-x-2">
            {/* Indent levels */}
            <div className="flex flex-row space-x-1">
              <IndentLine
                content={(row.original as Test).testName}
                level={indentLevels[row.id]}
              />
              {running.includes(row.original.id) && (
                <Loader className="scale-50" />
              )}
            </div>
            {/* {(row.original as Test).test_name} */}
          </div>
        ) : (
          <IndentLine
            content={
              <div className="flex flex-col">
                <b>
                  {(row.original as Conditional).conditionalType.toUpperCase()}
                </b>
                <i>
                  {(row.original as Conditional).condition.substring(0, 45)}
                  {(row.original as Conditional).condition.length >= 45 && (
                    <>...</>
                  )}
                </i>
              </div>
            }
            level={indentLevels[row.id]}
          />
        );
      },
    },

    // {
    //   accessorFn: (elem) => {
    //     return elem.type === "test" ? "runInParallel" : null;
    //   },
    //   header: "Run in Parallel",
    //   cell: ({ row }) => {
    //     return row.original.type === "test" ? (
    //       <div>{row.original.runInParallel.toString()}</div>
    //     ) : null;
    //   },
    // },

    {
      accessorFn: (elem) => {
        return elem.type === "test" ? "type" : null;
      },
      header: "Test Type",
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div>{row.original.testType}</div>
        ) : null;
      },
    },

    {
      accessorFn: (elem) => {
        return elem.type === "test" ? "status" : null;
      },
      header: "Status",
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div>{mapStatusToDisplay[row.original.status]}</div>
        ) : null;
      },
    },

    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      accessorFn: (elem, _) => {
        return elem.type === "test" ? "completionTime" : null;
      },
      header: "Completion Time",
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div>
            {row.original.completionTime &&
              row.original.completionTime.toFixed(2)}
          </div>
        ) : null;
      },
    },

    // {
    //   accessorKey: "isSavedToCloud",
    //   header: "Saved to Flojoy Cloud",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return row.getValue("isSavedToCloud") ? (
    //       <Button>OPEN TEST</Button>
    //     ) : null;
    //   },
    // },

    {
      accessorKey: "up-down",
      header: () => <div className="text-center">Reorder</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const onUpClick = () => {
          setRowSelection([]);
          setElems((data) => {
            const new_data = [...data];
            const index = parseInt(row.id);
            if (index == 0) return data;
            new_data[index] = data[index - 1];
            new_data[index - 1] = data[index];
            return new_data;
          });
        };
        const onDownClick = () => {
          setRowSelection([]);
          setElems((data) => {
            const new_data = [...data];
            const index = parseInt(row.id);
            if (index == data.length) return data;
            new_data[index] = data[index + 1];
            new_data[index + 1] = data[index];
            return new_data;
          });
        };
        return (
          <div className="flex flex-row justify-center">
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: elems,
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

  const handleClickRemoveTests = () => {
    onRemoveTest(map(Object.keys(rowSelection), (idxStr) => parseInt(idxStr)));
    setRowSelection([]);
  };

  const onRemoveTest = (idxs: number[]) => {
    setElems((elems) => {
      //first, collect all idxs to remove in a set
      const toRemove = new Set();
      idxs.forEach((idx) => {
        toRemove.add(elems[idx].groupId);
      });
      console.log(elems);
      console.log(idxs);
      const new_elems = filter(elems, (elem) => !toRemove.has(elem.groupId));
      console.log(new_elems);
      return new_elems;
    });
  };

  const addConditionalAfterIdx = useRef(-1);

  const [showWriteConditionalModal, setShowWriteConditionalModal] =
    useState(false);
  const writeConditionalForIdx = useRef(-1);

  const handleWriteConditionalModal = (input: string) => {
    setElems((data) => {
      const new_data = [...data];
      const conditional = new_data[
        writeConditionalForIdx.current
      ] as Conditional;
      new_data[writeConditionalForIdx.current] = {
        ...conditional,
        condition: input,
      };
      return new_data;
    });
  };

  const handleAddConditionalModal = (type: ConditionalComponent) => {
    setElems((data) => {
      const new_data = [...data];
      new_data.splice(
        addConditionalAfterIdx.current,
        0,
        ...generateConditional(type),
      );
      return new_data;
    });
  };

  const handleClickAddConditional = (idx: number) => {
    addConditionalAfterIdx.current = idx;
    handleAddConditionalModal("if");
  };

  const onClickWriteCondition = (idx: number) => {
    writeConditionalForIdx.current = idx;
    setShowWriteConditionalModal(true);
  };

  const getSpecificContextMenuItems = (row: Row<TestSequenceElement>) => {
    switch (row.original.type) {
      case "test":
        return <></>;
      case "conditional":
        return (
          <>
            <ContextMenuItem
              onClick={() => onClickWriteCondition(parseInt(row.id))}
            >
              Write Condition
            </ContextMenuItem>
          </>
        );
    }
  };

  useEffect(() => {
    if (addIfStatement) {
      handleAddConditionalModal("if");
    }
  }, [addIfStatement]);

  return (
    <div className="flex flex-col">
      <WriteConditionalModal
        isConditionalModalOpen={showWriteConditionalModal}
        handleWriteConditionalModalOpen={setShowWriteConditionalModal}
        handleWrite={handleWriteConditionalModal}
      />
      <div className="m-1 flex items-center py-0">
        <LockableButton
          disabled={Object.keys(rowSelection).length == 0}
          onClick={handleClickRemoveTests}
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell isCompact={true} key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {getSpecificContextMenuItems(row)}
                    <ContextMenuItem
                      onClick={() =>
                        handleClickAddConditional(parseInt(row.id))
                      }
                    >
                      Add Conditional
                    </ContextMenuItem>
                    <ContextMenuItem>Show Output Plot</ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => onRemoveTest([parseInt(row.id)])}
                    >
                      Remove Test
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
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
      </div>
    </div>
  );
}
