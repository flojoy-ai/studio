import { cn } from "@/renderer/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Check } from "lucide-react";
import { forwardRef, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (test: string) => void;
  placeholder?: string;
};

export const Autocomplete = forwardRef<HTMLInputElement, Props>(
  ({ options, value, onChange, placeholder }, ref) => {
    const [selected, setSelected] = useState(false);

    return (
      <div className="relative">
        <Command>
          <CommandInput
            ref={ref}
            placeholder={placeholder}
            value={value}
            onValueChange={onChange}
            onSelect={() => setSelected(true)}
            // FIXME: Select hack
            onBlur={() => setTimeout(() => setSelected(false), 100)}
          />
          <CommandList className="max-h-[160px] absolute top-[45px] bg-background w-full shadow-md rounded-b-lg">
            {selected && options.length > 0 && (
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem key={opt} value={opt} onSelect={onChange}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    );
  },
);
