import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import React, { useEffect } from "react";

export const CommandMenu = ({
  emptyText,
  groups,
  open,
  placeholder,
  setOpen,
}: {
  emptyText?: string;
  groups?: React.ReactNode;
  open: boolean;
  placeholder?: string;
  setOpen: (open: boolean) => void;
}) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) setOpen(!open);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={placeholder || "Type a command or search..."}
      />
      <CommandList className="h-[600px]">
        <CommandEmpty>{emptyText || "No results found."}</CommandEmpty>
        {groups}
      </CommandList>
    </CommandDialog>
  );
};
