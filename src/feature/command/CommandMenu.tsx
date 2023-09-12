import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import {
  TreeNode,
  isLeaf,
  isRoot,
  isLeafParentNode,
} from "@src/utils/ManifestLoader";
import React, { Fragment } from "react";

const commandGroups = (
  node: TreeNode,
  onSelect: (node: TreeNode) => void,
): React.ReactNode => {
  if (!node) return null;

  if (isLeaf(node))
    return (
      <CommandItem key={node.name} onSelect={() => onSelect(node)}>
        {node.name}
      </CommandItem>
    );

  if (!isRoot(node) && !isLeafParentNode(node))
    return (
      <Fragment key={node.name}>
        <CommandGroup heading={node.name}>
          {node.children?.map((c: TreeNode) => commandGroups(c, onSelect))}
        </CommandGroup>
        <CommandSeparator />
      </Fragment>
    );

  return node.children?.map((c: TreeNode) => commandGroups(c, onSelect));
};

export const CommandMenu = ({
  emptyText,
  manifestRoot,
  open,
  placeholder,
  setOpen,
  onItemSelect,
}: {
  emptyText?: string;
  manifestRoot?: TreeNode;
  open: boolean;
  placeholder?: string;
  setOpen: (open: boolean) => void;
  onItemSelect: (node: TreeNode) => void;
}) => {
  useKeyboardShortcut("ctrl", "k", () => setOpen(!open));
  useKeyboardShortcut("meta", "k", () => setOpen(!open));

  const groups = commandGroups(manifestRoot, onItemSelect);

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
