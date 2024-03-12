import { useCallback, useRef, useState } from "react";

export const useContextMenu = <MI>() => {
  const [menu, setMenu] = useState<MI | null>(null);
  const flowRef = useRef<HTMLDivElement | null>(null);
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return { menu, setMenu, flowRef, onPaneClick };
};
