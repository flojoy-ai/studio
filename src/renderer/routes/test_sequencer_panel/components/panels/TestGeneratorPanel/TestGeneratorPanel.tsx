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
import { GenerateTestRequest, Test } from "@/renderer/types/testSequencer";
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
import { baseClient } from "@/renderer/lib/base-client";

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

export const TestGeneratorPanel = () => {
  const [data, setData] = useState<Test[]>([] as Test[]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [prompt, setPrompt] = useState("");
  async function handleClickGenerate() {
    const body: GenerateTestRequest = {
      testType: "Python",
      prompt: prompt,
    };
    const { data } = await baseClient.post("generate-test", body);
    const data_obj = JSON.parse(data);
    console.log(data_obj.test);
    setData((prevData) => {
      return [...prevData, { ...data_obj.test }];
    });
  }
  return (
    <div className="flex w-full flex-col space-y-4">
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
      <Button type="submit" onClick={handleClickGenerate}>
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
