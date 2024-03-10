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
  StatusType,
  Test,
} from "@/renderer/types/test-sequencer";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { parseInt, filter, map } from "lodash";
import {
  generateConditional,
  getIndentLevels,
} from "@/renderer/routes/test_sequencer_panel/utils/ConditionalUtils";
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from "lucide-react";
import { WriteConditionalModal } from "@/renderer/routes/test_sequencer_panel/components/AddWriteConditionalModal";
import LockableButton from "@/renderer/routes/test_sequencer_panel/components/lockable/LockedButtons";
import { useRef, useState, useEffect } from "react";
import TestNameCell from "./test-name-cell";
import { DraggableRow } from "@/renderer/routes/test_sequencer_panel/components/dnd/DraggableRow";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/renderer/components/ui/hover-card";
import PythonTestFileModal from "@/renderer/routes/test_sequencer_panel/components/PythonTestFileModal";

function renderErrorMessage(text: string): JSX.Element {
  const lines = text.split("\n");
  return (
    <div className="mt-2 max-h-[400px] overflow-y-auto whitespace-pre rounded-md bg-secondary p-2">
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}

const mapStatusToDisplay: { [k in StatusType] } = {
  pending: <p className="text-yellow-500">PENDING</p>,
  pass: <p className="text-green-500">PASS</p>,
  failed: (status: string | null) =>
    status === null || status === "" ? (
      <p className="text-red-500">FAIL</p>
    ) : (
      <HoverCard>
        <HoverCardTrigger>
          <p className="text relative z-20 text-red-500 underline underline-offset-2">
            FAIL
          </p>
        </HoverCardTrigger>
        <HoverCardContent className="w-256">
          <h2 className="text-muted-foreground">Error Message:</h2>
          {renderErrorMessage(status)}
        </HoverCardContent>
      </HoverCard>
    ),
};

export function DataTable() {
  const { elems, setElems, running } = useTestSequencerState();
  const [addIfStatement] = useState(false);
  const indentLevels = getIndentLevels(elems);
  const [openPyTestFileModal, setOpenPyTestFileModal] = useState(false);
  const [testToDisplay, setTestToDisplay] = useState<Test | null>(null);

  function toggleExportToCloud(id: string) {
    setElems.withException((elems) => {
      const newElems = [...elems];
      const idx = newElems.findIndex((elem) => elem.id === id);
      newElems[idx] = {
        ...newElems[idx],
        exportToCloud: !newElems[idx].exportToCloud,
      } as Test;
      return newElems;
    });
  }

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
      accessorFn: (elem) => {
        return elem.type === "test" ? "testName" : "conditionalType";
      },
      header: "Test name",
      cell: (props) => {
        return (
          <TestNameCell
            cellProps={props}
            running={running}
            indentLevels={indentLevels}
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
          <div>
            {typeof mapStatusToDisplay[row.original.status] === "function"
              ? mapStatusToDisplay[row.original.status](row.original.error)
              : mapStatusToDisplay[row.original.status]}
          </div>
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

    {
      accessorFn: (elem) => {
        return elem.type === "test" ? "isSavedToCloud" : null;
      },
      header: "Saved To Cloud",
      cell: ({ row }) => {
        if (row.original.type === "test") {
          if (!row.original.exportToCloud) {
            return <div> - </div>;
          } else {
            return (
              <div
                className={
                  row.original.isSavedToCloud
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {row.original.isSavedToCloud ? "Saved" : "Not Saved"}
              </div>
            );
          }
        }
        return null;
      },
    },

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
      const new_elems = filter(elems, (elem) => !toRemove.has(elem.groupId));
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
        setConditionalModalOpen={setShowWriteConditionalModal}
        handleWriteConditionalModalOpen={setShowWriteConditionalModal}
        handleWrite={handleWriteConditionalModal}
      />
      {openPyTestFileModal && (
        <PythonTestFileModal
          isModalOpen={openPyTestFileModal}
          handleModalOpen={setOpenPyTestFileModal}
          test={testToDisplay as Test}
        />
      )}
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
                    {/* <TableRow */}
                    {/*   className="relative" */}
                    {/*   data-state={row.getIsSelected() && "selected"} */}
                    {/* > */}
                    {/*   {row.getVisibleCells().map((cell) => ( */}
                    {/*     <TableCell isCompact={true} key={cell.id}> */}
                    {/*       {flexRender( */}
                    {/*         cell.column.columnDef.cell, */}
                    {/*         cell.getContext(), */}
                    {/*       )} */}
                    {/*     </TableCell> */}
                    {/*   ))} */}
                    {/* </TableRow> */}

                    <DraggableRow
                      row={row}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    />
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
                    <ContextMenuItem
                      onClick={() => onRemoveTest([parseInt(row.id)])}
                    >
                      Remove Test
                    </ContextMenuItem>
                    {row.original.type === "test" && (
                      <ContextMenuItem
                        onClick={() => {
                          setOpenPyTestFileModal(true);
                          setTestToDisplay(row.original as Test);
                        }}
                      >
                        Consult Code
                      </ContextMenuItem>
                    )}
                    {row.original.type === "test" && (
                      <ContextMenuItem
                        onClick={() => {
                          toggleExportToCloud(row.original.id);
                        }}
                      >
                        {row.original.exportToCloud
                          ? "Disable export to Cloud"
                          : "Enable export to Cloud"}
                      </ContextMenuItem>
                    )}
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
