import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type Modifier = "ctrl" | "alt" | "shift" | "meta";
const useKeyboardShortcut = (
  modifier: Modifier,
  shortcut: string,
  callback: () => void,
) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleShortcut = useCallback(
    (event: KeyboardEvent) => {
      switch (modifier) {
        case "ctrl":
          if (event.key === shortcut && event.ctrlKey) {
            event.preventDefault();
            callbackRef.current();
          }
          break;
        case "alt":
          if (event.key === shortcut && event.altKey) {
            event.preventDefault();
            callbackRef.current();
          }
          break;
        case "shift":
          if (event.key === shortcut && event.shiftKey) {
            event.preventDefault();
            callbackRef.current();
          }
          break;
        case "meta":
          if (event.key === shortcut && event.metaKey) {
            event.preventDefault();
            callbackRef.current();
          }
          break;
      }
    },
    [shortcut],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);
};

export default useKeyboardShortcut;
