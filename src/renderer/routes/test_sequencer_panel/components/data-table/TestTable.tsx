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
} from "@/renderer/types/test-sequencer";
import { useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";
import { parseInt, filter, map } from "lodash";
import {
  generateConditional,
  getIndentLevels,
} from "@/renderer/routes/test_sequencer_panel/utils/ConditionalUtils";
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from "lucide-react";
import { WriteConditionalModal } from "@/renderer/routes/test_sequencer_panel/components/modals/AddWriteConditionalModal";
import LockableButton from "@/renderer/routes/test_sequencer_panel/components/lockable/LockedButtons";
import { useRef, useState, useEffect } from "react";
import TestNameCell from "./test-name-cell";
import { DraggableRowStep } from "@/renderer/routes/test_sequencer_panel/components/dnd/DraggableRowStep";
import PythonTestFileModal from "@/renderer/routes/test_sequencer_panel/components/modals/PythonTestFileModal";
import { mapStatusToDisplay } from "./utils";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { useSequencerModalStore } from "@/renderer/stores/modal";
import { WriteMinMaxModal } from "@/renderer/routes/test_sequencer_panel/components/modals/WriteMinMaxModal";
import { toast } from "sonner";
import { ChangeLinkedTestModal } from "../modals/ChangeLinkedTest";
import { ImportType } from "../modals/ImportTestModal";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";

export function TestTable() {
  const { elems, setElems } = useDisplayedSequenceState();
  const { openRenameTestModal, setIsImportTestModalOpen } =
    useSequencerModalStore();
  const { isAdmin } = useWithPermission();
  const [addIfStatement] = useState(false);
  const indentLevels = getIndentLevels(elems);
  const [openPyTestFileModal, setOpenPyTestFileModal] = useState(false);
  const [testToDisplay, setTestToDisplay] = useState<Test | null>(null);
  const testSequenceDisplayed = useSequencerStore(
    useShallow((state) => state.testSequenceDisplayed),
  );

  function toggleExportToCloud(id: string) {
    setElems((elems) => {
      return elems.map((elem) => {
        if (elem.id === id) {
          if (elem.type === "test") {
            return {
              ...elem,
              exportToCloud: !elem.exportToCloud,
            };
          }
        }
        return elem;
      });
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
          className="relative z-20 my-2"
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
        return <TestNameCell cellProps={props} indentLevels={indentLevels} />;
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
      id: "Test Type",
      accessorFn: (elem) => {
        return elem.type === "test" ? "type" : null;
      },
      header: () => <div className="pl-4 text-center">Type</div>,
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div className="flex justify-center">{row.original.testType}</div>
        ) : null;
      },
    },

    {
      id: "Min",
      accessorFn: (elem) => {
        return elem.type === "test" ? "min" : null;
      },
      header: () => <div className="pl-4 text-center">Min</div>,
      cell: ({ row }) => {
        return row.original.type === "test" &&
          row.original.minValue !== undefined ? (
          <div className="my-2 flex justify-center">
            <code className="text-muted-foreground">
              {row.original.minValue}
            </code>
          </div>
        ) : null;
      },
    },

    {
      id: "Result",
      accessorFn: (elem) => {
        return elem.type === "test" ? "result" : null;
      },
      header: () => <div className="pl-4 text-center">Result</div>,
      cell: ({ row }) => {
        return row.original.type === "test" &&
          row.original.measuredValue !== undefined ? (
          <div className="my-2 flex justify-center">
            <code>{row.original.measuredValue}</code>
          </div>
        ) : null;
      },
    },

    {
      id: "Max",
      accessorFn: (elem) => {
        return elem.type === "test" ? "max" : null;
      },
      header: () => <div className="pl-4 text-center">Max</div>,
      cell: ({ row }) => {
        return row.original.type === "test" &&
          row.original.maxValue !== undefined ? (
          <div className="my-2 flex justify-center">
            <code className=" text-muted-foreground">
              {row.original.maxValue}
            </code>
          </div>
        ) : null;
      },
    },

    {
      id: "Unit",
      accessorFn: (elem) => {
        return elem.type === "test" ? "unit" : null;
      },
      header: () => <div className="pl-4 text-center">Unit</div>,
      cell: ({ row }) => {
        return row.original.type === "test" &&
          row.original.unit !== undefined ? (
          <div className="flex justify-center">
            <code className="my-2 text-muted-foreground">
              {row.original.unit}
            </code>
          </div>
        ) : null;
      },
    },

    {
      id: "Export",
      accessorFn: (elem) => {
        return elem.type === "test" ? "isSavedToCloud" : null;
      },
      header: () => <div className="pl-4 text-center">Export</div>,
      cell: ({ row }) => {
        if (row.original.type === "test") {
          return (
            <div className="flex justify-center">
              <Checkbox
                className="relative z-10 my-2"
                checked={row.original.exportToCloud}
                onCheckedChange={() => toggleExportToCloud(row.original.id)}
              />
            </div>
          );
        }
        return null;
      },
    },

    {
      id: "Completion Time",
      accessorFn: (elem) => {
        return elem.type === "test" ? "completionTime" : null;
      },
      header: () => <div className="pl-4 text-center">Time</div>,
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div className="flex justify-center">
            {row.original.completionTime
              ? `${row.original.completionTime.toFixed(2)}s`
              : "0.00s"}
          </div>
        ) : null;
      },
    },

    {
      id: "Status",
      accessorFn: (elem) => {
        return elem.type === "test" ? "status" : null;
      },
      header: () => <div className="pl-4 text-center">Status</div>,
      cell: ({ row }) => {
        return row.original.type === "test" ? (
          <div
            className="my-2 flex justify-center"
            data-testid={`status-${row.original.testName}`}
          >
            {typeof mapStatusToDisplay[row.original.status] === "function"
              ? mapStatusToDisplay[row.original.status](row.original.error)
              : mapStatusToDisplay[row.original.status]}
          </div>
        ) : null;
      },
    },

    {
      accessorKey: "up-down",
      header: () => <div className="text-center">Reorder</div>,
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "up-down": false,
    "Completion Time": false,
    "Test Type": isAdmin(),
    Status: isAdmin(),
    Export: isAdmin(),
    selected: isAdmin(),
  });
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

  // Remove ----------------------

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

  // Conditional ------------------

  const addConditionalAfterIdx = useRef(-1);

  const [showWriteConditionalModal, setShowWriteConditionalModal] =
    useState(false);
  const writeConditionalForIdx = useRef(-1);

  const [showWriteMinMaxModal, setShowWriteMinMaxModal] = useState(false);
  const writeMinMaxForIdx = useRef(-1);

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

  // Edit MinMax ------------------

  const onClickWriteMinMax = (idx: number) => {
    writeMinMaxForIdx.current = idx;
    setShowWriteMinMaxModal(true);
  };

  const onSubmitWriteMinMax = (
    minValue: number,
    maxValue: number,
    unit: string,
  ) => {
    setElems((data) => {
      const new_data = [...data];
      const test = new_data[writeMinMaxForIdx.current] as Test;
      new_data[writeMinMaxForIdx.current] = {
        ...test,
        minValue: isNaN(minValue) ? undefined : minValue,
        maxValue: isNaN(maxValue) ? undefined : maxValue,
        unit,
      };
      return new_data;
    });
  };

  // Change linked test ------------

  const [openLinkedTestModal, setOpenLinkedTestModal] = useState(false);
  const testRef = useRef(-1);

  const handleChangeLinkedTest = (newPath: string, testType: ImportType) => {
    setElems((data) => {
      const new_data = [...data];
      const test = new_data[testRef.current] as Test;
      new_data[testRef.current] = {
        ...test,
        path: newPath,
        testType: testType,
      };
      return new_data;
    });
  };

  // Context Menu ------------------

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
  }, [addIfStatement, handleAddConditionalModal]);

  return (
    <div className="flex flex-col">
      <WriteConditionalModal
        isConditionalModalOpen={showWriteConditionalModal}
        setConditionalModalOpen={setShowWriteConditionalModal}
        handleWriteConditionalModalOpen={setShowWriteConditionalModal}
        handleWrite={handleWriteConditionalModal}
      />
      <WriteMinMaxModal
        isModalOpen={showWriteMinMaxModal}
        setModalOpen={setShowWriteMinMaxModal}
        handleWrite={onSubmitWriteMinMax}
      />
      <ChangeLinkedTestModal
        isModalOpen={openLinkedTestModal}
        setModalOpen={setOpenLinkedTestModal}
        handleSubmit={handleChangeLinkedTest}
      />
      {openPyTestFileModal && (
        <PythonTestFileModal
          isModalOpen={openPyTestFileModal}
          handleModalOpen={setOpenPyTestFileModal}
          test={testToDisplay as Test}
        />
      )}
      <div className="m-1 flex items-center py-0">
        {isAdmin() ? (
          <LockableButton
            disabled={Object.keys(rowSelection).length == 0}
            onClick={handleClickRemoveTests}
            variant="ghost"
            className="gap-2 whitespace-nowrap p-2"
          >
            <TrashIcon size={20} />
            <div className="hidden sm:block">Remove selected items</div>
          </LockableButton>
        ) : (
          <h2 className="text-l ml-1 inline-flex font-bold text-muted-foreground">
            Test Steps
            <div className="px-1" />
            <p className="font-thin text-muted-foreground">
              {testSequenceDisplayed !== null
                ? ` for ${testSequenceDisplayed?.name}`
                : ""}
            </p>
          </h2>
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

                    <DraggableRowStep
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
                    {row.original.type === "test" &&
                      row.original.testType !== "placeholder" && (
                        <>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onClick={() => {
                              setOpenPyTestFileModal(true);
                              setTestToDisplay(row.original as Test);
                            }}
                          >
                            Consult Code
                          </ContextMenuItem>
                        </>
                      )}
                    {row.original.type === "test" &&
                      row.original.testType === "placeholder" && (
                        <>
                          <ContextMenuSeparator />
                          <ContextMenuItem disabled={true}>
                            Not Linked to any code
                          </ContextMenuItem>
                        </>
                      )}
                    {row.original.type === "test" && (
                      <>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          onClick={() => {
                            openRenameTestModal(row.original.id);
                          }}
                        >
                          Rename Test
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            toggleExportToCloud(row.original.id);
                          }}
                        >
                          {row.original.exportToCloud
                            ? "Disable export to Cloud"
                            : "Enable export to Cloud"}
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            onClickWriteMinMax(parseInt(row.id));
                          }}
                        >
                          Edit Expected Value
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={() => {
                            setOpenLinkedTestModal(true);
                            testRef.current = parseInt(row.id);
                            setTestToDisplay(row.original as Test);
                          }}
                        >
                          Change executable
                        </ContextMenuItem>
                      </>
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onClick={() => onRemoveTest([parseInt(row.id)])}
                    >
                      {row.original.type === "test"
                        ? "Remove Test"
                        : "Remove Conditional"}
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
                      setIsImportTestModalOpen(true);
                    } else {
                      toast.info(
                        "Connect to Flojoy Cloud and select a Test Profile",
                      );
                    }
                  }}
                >
                  No Tests
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isAdmin() && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        </div>
      )}
    </div>
  );
}
