import { Button } from "@src/components/ui/button";
import { API_URI } from "@src/data/constants";
import { useSettings } from "@src/hooks/useSettings";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@src/components/ui/popover";
import { useState } from "react";
import { cn } from "@src/lib/utils";

type Device = {
  description: string;
  device: string;
  name: string;
};

const PortSelect = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [ports, setPorts] = useState<Device[]>([]);
  const { updateSettings } = useSettings("micropython");

  async function fetchPorts() {
    try {
      const response = await fetch(`${API_URI}/serial_ports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resp = await response.json();
      console.log(resp);
      return resp.ports;
    } catch (err) {
      console.error(err);
    }
  }

  const handleClick = () => {
    fetchPorts()
      .then((data) => {
        // console.log("Available ports:", data);
        setPorts(data);
      })
      .catch((err) => {
        console.error("Error while fetching ports", err);
      });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          onClick={handleClick}
        >
          {value
            ? ports.find((port) => port.device === value)?.device
            : "Select microcontroller..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search port..." />
          <CommandEmpty>No device found.</CommandEmpty>
          <CommandGroup>
            {ports.map((port) => (
              <CommandItem
                key={port.device}
                onSelect={() => {
                  setValue(port.device === value ? "" : port.device);
                  port.device === value
                    ? updateSettings("selectedPort", "")
                    : updateSettings("selectedPort", port.device);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === port.device ? "opacity-100" : "opacity-0",
                  )}
                />
                {port.device}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PortSelect;
