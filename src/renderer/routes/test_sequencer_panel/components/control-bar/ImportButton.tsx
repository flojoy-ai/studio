import { MenubarItem, MenubarShortcut } from "@/renderer/components/ui/menubar";
import { useImportSequences } from "@/renderer/hooks/useTestSequencerProject";

export const ImportSequencesButton = () => {
  const importSequences = useImportSequences();

  return (
    <MenubarItem
      onClick={importSequences}
      id="load-app-btn"
      data-testid="load-app-btn"
    >
      Import sequences<MenubarShortcut>⌘O</MenubarShortcut>
    </MenubarItem>
  );
};

