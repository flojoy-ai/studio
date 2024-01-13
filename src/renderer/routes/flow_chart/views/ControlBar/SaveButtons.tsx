import { MenubarItem, MenubarShortcut } from "@src/components/ui/menubar";
import { useSave } from "@src/hooks/useSave";

export const SaveButton = () => {
  const handleSave = useSave();

  return (
    <MenubarItem data-testid="btn-save" onClick={handleSave}>
      {/* TODO: Add logo for windows and linux */}
      Save <MenubarShortcut>⌘S</MenubarShortcut>
    </MenubarItem>
  );
};

export const SaveAsButton = () => {
  const handleSave = useSave();

  return (
    <MenubarItem data-testid="btn-saveas" onClick={handleSave}>
      Save As{" "}
    </MenubarItem>
  );
};
