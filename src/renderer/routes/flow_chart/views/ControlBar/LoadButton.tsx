import { MenubarItem, MenubarShortcut } from "@src/components/ui/menubar";
import { useLoadApp } from "@src/hooks/useLoadApp";

export const LoadButton = () => {
  const openFileSelector = useLoadApp();

  return (
    <MenubarItem onClick={openFileSelector} id="load-app-btn">
      {/* TODO: Add logo for windows and linux */}
      Load <MenubarShortcut>⌘O</MenubarShortcut>
    </MenubarItem>
  );
};
