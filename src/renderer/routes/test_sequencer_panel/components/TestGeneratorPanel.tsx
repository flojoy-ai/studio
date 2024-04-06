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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { GeneratedTest } from "./GeneratedTest";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/renderer/components/ui/command";
// import { cn } from "@/renderer/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/renderer/components/ui/context-menu";
import { toast } from "sonner";
import { Test, TestGenerateResponse } from "@/renderer/types/test-sequencer";
import { tryParse } from "@/types/result";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFillPlaceholdersAndAddTest } from "./TestGenerationInputModal";

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

// const testTypes: { value: TestTypes; label: string }[] = [
//   { value: "Python", label: "Python" },
//   { value: "Pytest", label: "Pytest" },
// ];

// might need this in the future
// const TestTypeCombobox = () => {
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState("");
//
//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {value
//             ? testTypes.find((type) => type.value === value)?.label
//             : "Select test type..."}
//           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder="Search test type..." className="h-9" />
//           <CommandEmpty>No test type found</CommandEmpty>
//           <CommandGroup>
//             {testTypes.map((framework) => (
//               <CommandItem
//                 key={framework.value}
//                 value={framework.value}
//                 onSelect={(currentValue) => {
//                   setValue(currentValue === value ? "" : currentValue);
//                   setOpen(false);
//                 }}
//               >
//                 {framework.label}
//                 <CheckIcon
//                   className={cn(
//                     "ml-auto h-4 w-4",
//                     value === framework.value ? "opacity-100" : "opacity-0",
//                   )}
//                 />
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };
type GeneratedTestStore = {
  tests: Test[];
  addTest: (test: Test) => void;
  removeTestById: (testId: string) => void;
};

export const useTestGenerateStore = create<GeneratedTestStore>()(
  immer((set) => ({
    tests: [],
    addTest: (newTest: Test) =>
      set((state) => {
        state.tests.push(newTest);
      }),
    removeTestById: (testId: string) =>
      set((state) => {
        state.tests = state.tests.filter((test) => test.id != testId);
      }),
  })),
);

export const TestGeneratorPanel = () => {
  const { tests: data, removeTestById } = useTestGenerateStore();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const fillPlaceholdersAndAddTest = useFillPlaceholdersAndAddTest();

  const handleGenerateTestClick = () => {
    return fetch("http://127.0.0.1:8000/generate-test/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // specify the content type
      },
      body: JSON.stringify({
        input: prompt,
        test_context: "random_context",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad response from test generation server");
        }
        return response.json();
      })
      .then((responseObj) => {
        tryParse(TestGenerateResponse)(responseObj).match(
          (value) => {
            console.log(value);
            fillPlaceholdersAndAddTest(name, value.code);
          },
          (error) => {
            console.error(error);
            toast.error(error.message);
            throw error;
          },
        );
      });
  };

  const handleRemoveTest = (testId: string) => {
    removeTestById(testId);
  };

  // TODO make sure test with the same name doesn't exist in project (no conflicting paths for a file)
  return (
    <div className="flex w-full flex-col space-y-4">
      <Label htmlFor="testName">Enter test name:</Label>
      <Input
        className="w-1/2"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        id="testName"
        placeholder="Test name"
      />
      <Label htmlFor="prompt">Enter prompt:</Label>
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        id="prompt"
        placeholder="Example: Test basic arithmetic operations"
      />
      {/* No need for this for now */}
      {/* <TestTypeCombobox /> */}
      <Button
        type="submit"
        onClick={() => {
          toast.promise(handleGenerateTestClick, {
            loading: "Generating test...",
            success: "Test generated successfully!",
          });
        }}
        disabled={name == "" || prompt == ""}
      >
        Generate
      </Button>
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
              table.getRowModel().rows.map((row) => (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <GeneratedTest
                      row={row}
                      data-state={row.getIsSelected() && "selected"}
                    />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => handleRemoveTest(row.original.id)}
                    >
                      Remove test
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
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
