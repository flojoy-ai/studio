import { MenubarItem } from "@/components/ui/menubar";
import { useLoadApp } from "@src/hooks/useLoadApp";

export const LoadButton = () => {
  const openFileSelector = useLoadApp();
  return (
    <MenubarItem onClick={openFileSelector} id="load-app-btn">
      Load
    </MenubarItem>
  );
};
