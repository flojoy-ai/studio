import { MenubarItem, MenubarShortcut } from "@/renderer/components/ui/menubar";
import { useImportSequences } from "@/renderer/hooks/useTestSequencerProject";

export const ImportSequenceButton = () => {
  const importSequence = useImportSequences();

  return (
    <MenubarItem
      onClick={importSequence}
      id="load-app-btn"
      data-testid="load-app-btn"
    >
      Import sequence<MenubarShortcut>⌘O</MenubarShortcut>
    </MenubarItem>
  );
};
