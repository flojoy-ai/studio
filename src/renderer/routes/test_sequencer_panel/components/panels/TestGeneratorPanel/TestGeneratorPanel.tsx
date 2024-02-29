import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Separator } from "@/renderer/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/renderer/components/ui/table";
import { Test } from "@/renderer/types/testSequencer";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { GeneratedTest } from "./GeneratedTest";

export const columns: ColumnDef<Test>[] = [
  {
    id: "name",
    header: "Test Name",
    cell: ({ row }) => {
      return <div>{row.original.testName}</div>;
    },
  },
  {
    id: "type",
    header: "Test Type",
    cell: ({ row }) => {
      return <div>{row.original.testType}</div>;
    },
  },
];

export const TestGeneratorPanel = () => {
  const [data] = useState<Test[]>([
    {
      type: "test",
      id: "sadasd",
      groupId: "sadasdfassf",
      path: "/sadkjnad",
      testName: "test",
      testType: "Pytest",
      runInParallel: false,
      status: "pending",
      error: null,
      completionTime: undefined,
      isSavedToCloud: false,
    },
  ] as Test[]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="flex w-full flex-col space-y-4">
      <Label htmlFor="prompt">Enter prompt:</Label>
      <Input
        type="text"
        id="prompt"
        placeholder="Example: Test basic arithmetic operations"
      />
      <Button type="submit">Generate</Button>
      <Separator />
      <Label htmlFor="generated-test">Generated tests:</Label>
      <div className="rounded-md border">
        <Table id="generated-test">
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
              table.getRowModel().rows.map((row) => <GeneratedTest row={row} />)
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Generated tests will appear here
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
