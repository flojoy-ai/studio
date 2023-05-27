import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type Motifier = "ctrl" | "alt" | "shift" | "meta";
const useKeyboardShortcut = (
  motifier: Motifier,
  shortcut: string,
  callback: () => void
) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleShortcut = useCallback(
    (event: KeyboardEvent) => {
      switch (motifier) {
        case "ctrl":
          if (event.key === shortcut && event.ctrlKey) {
            callbackRef.current();
          }
          break;
        case "alt":
          if (event.key === shortcut && event.altKey) {
            callbackRef.current();
          }
          break;
        case "shift":
          if (event.key === shortcut && event.shiftKey) {
            callbackRef.current();
          }
          break;
        case "meta":
          if (event.key === shortcut && event.metaKey) {
            callbackRef.current();
          }
          break;
      }
    },
    [shortcut]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);
};

export default useKeyboardShortcut;
