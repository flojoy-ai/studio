import { cn } from "@/renderer/lib/utils";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Check } from "lucide-react";
import { forwardRef, useRef, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (test: string) => void;
  placeholder?: string;
};

export const Autocomplete = forwardRef<HTMLInputElement, Props>(
  ({ options, value, onChange, placeholder }, ref) => {
    const [selected, setSelected] = useState(false);
    const cmdRef = useRef<HTMLDivElement | null>(null);

    return (
      <div className="relative">
        <Command ref={cmdRef}>
          <CommandInput
            ref={ref}
            placeholder={placeholder}
            value={value}
            onValueChange={onChange}
            onSelect={() => setSelected(true)}
            className="h-10"
            onBlur={(e) => {
              if (e.relatedTarget === cmdRef.current) {
                return;
              }
              setSelected(false);
            }}
            autoFocus={true}
          />
          {selected && options.length > 0 && (
            <CommandList className="absolute top-[45px] z-10 max-h-[160px] w-full rounded-lg border bg-background">
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={(val) => {
                      onChange(val);
                      setSelected(false);
                    }}
                  >
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
            </CommandList>
          )}
        </Command>
      </div>
    );
  },
);
