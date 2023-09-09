import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import React from "react";

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
  useKeyboardShortcut("ctrl", "k", () => setOpen(!open));
  useKeyboardShortcut("meta", "k", () => setOpen(!open));

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
