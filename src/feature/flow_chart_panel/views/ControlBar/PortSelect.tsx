import { Button } from "@src/components/ui/button";
import { API_URI } from "@src/data/constants";
import { useSettings } from "@src/hooks/useSettings";
import { Check, ChevronsUpDown} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@src/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@src/components/ui/popover"
import { useEffect, useState } from "react";
import { cn } from "@src/lib/utils";

const PortSelect = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [ports, setPorts] = useState([]);
  const {updateSettings} = useSettings("micropython");

  async function fetchPorts() {
    try {
      const response = await fetch(`${API_URI}/serial_ports`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const resp = await response.json();
      return resp.ports;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPorts().then((data) => {
        // console.log("Available ports:", data);
        setPorts(data);
      });
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? ports.find((port) => port.device === value)?.name
            : "Select microcontroller..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No device found.</CommandEmpty>
          <CommandGroup>
            {ports.map((port) => (
              <CommandItem
                key={port.device}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  currentValue === value ? null : updateSettings("selectedPort", currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === port.device ? "opacity-100" : "opacity-0",
                  )}
                />
                {port.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PortSelect;
