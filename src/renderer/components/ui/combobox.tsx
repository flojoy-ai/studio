import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";
import { Button } from "./button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";
import { cn } from "@/renderer/lib/utils";

type Props<T> = {
  options: T[];
  value: string;
  onValueChange: (val: string) => void;
  valueSelector: (x: T) => string;
  displaySelector: (x: T) => string;
};

export function Combobox<T>({
  options,
  value,
  onValueChange,
  valueSelector,
  displaySelector,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => valueSelector(opt) === value);
  const placeholder = selected ? displaySelector(selected) : "Select...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={valueSelector(opt)}
                value={valueSelector(opt)}
                onSelect={() => {
                  onValueChange(valueSelector(opt));
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === valueSelector(opt) ? "opacity-100" : "opacity-0",
                  )}
                />
                {displaySelector(opt)}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
