import { MenubarItem, MenubarShortcut } from "@/renderer/components/ui/menubar";
import { useImportProject} from "@/renderer/hooks/useTestSequencerProject";

export const ImportSequenceButton = () => {
  const importSequence = useImportProject();

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
