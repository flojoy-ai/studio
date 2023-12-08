import { baseClient } from "@src/lib/base-client";
import { RootNode } from "@src/utils/ManifestLoader";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
const customBlockManifestAtom = atom<RootNode | null>(null);
export const manifestChangedAtom = atom<boolean>(true);

export const useCustomSections = () => {
  const setCustomBlockManifest = useSetAtom(customBlockManifestAtom);
  const customSections = useAtomValue(customBlockManifestAtom);
  const handleImportCustomBlocks = useCallback(async () => {
    const blocksDirPath = await window.api.pickDirectory();
    if (!blocksDirPath) {
      return;
    }
    const prevManifest = customSections;
    setCustomBlockManifest(null);
    try {
      const res = await baseClient.get(
        `blocks/manifest?blocks_path=${blocksDirPath}`,
      );
      setCustomBlockManifest(res.data);
    } catch (error) {
      console.error(error);
      setCustomBlockManifest(prevManifest);
    }
  }, [customSections, setCustomBlockManifest]);
  return {
    handleImportCustomBlocks,
    customSections,
  };
};
