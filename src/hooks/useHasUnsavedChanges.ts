import { atom, useAtom } from "jotai";

export const unsavedChangesAtom = atom<boolean>(true);

export const useHasUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useAtom(unsavedChangesAtom);

  const setter = (hasUnsaved: boolean) => {
    setHasUnsavedChanges(hasUnsaved);
    if ("api" in window) {
      window.api.setUnsavedChanges(hasUnsaved);
    }
  };

  return { hasUnsavedChanges, setHasUnsavedChanges: setter };
};
