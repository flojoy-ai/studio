import { baseClient } from "@src/lib/base-client";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { RootNode, validateRootSchema } from "@src/utils/ManifestLoader";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { toast } from "sonner";
import { manifestChangedAtom } from "./useManifest";

// undefined = loading state
const customBlockManifestAtom = atom<RootNode | undefined | null>(null);
const customBlocksMetadataMapAtom = atom<BlocksMetadataMap | undefined | null>(
  null,
);

export const useCustomSections = () => {
  const [customBlocksMetadata, setCustomBlocksMetadata] = useAtom(
    customBlocksMetadataMapAtom,
  );
  const [customBlockManifest, setCustomBlockManifest] = useAtom(
    customBlockManifestAtom,
  );
  const setManifestChanged = useSetAtom(manifestChangedAtom);
  const handleImportCustomBlocks = useCallback(
    async (startup: boolean) => {
      const blocksDirPath = !startup
        ? await window.api.pickDirectory()
        : await window.api.getCustomBlocksDir();

      if (!blocksDirPath) {
        return;
      }

      try {
        const res = await baseClient.get(
          `blocks/manifest?blocks_path=${blocksDirPath}`,
        );
        const validateResult = validateRootSchema(res.data);
        if (!validateResult.success) {
          // toast.message(`Failed to validate blocks manifest with Zod schema!`, {
          //   duration: 20000,
          //   description: "Expand log to see more info...",
          // });
          // window.api?.sendLogToStatusbar("Zod validation error: ");
          // window.api?.sendLogToStatusbar(validateResult.error.message);
          console.error(validateResult.error);
        }
        setCustomBlockManifest(res.data);
        window.api.cacheCustomBlocksDir(blocksDirPath);
        const res2 = await baseClient.get(
          `blocks/metadata?blocks_path=${blocksDirPath}&custom_dir_changed=${!startup}`,
        );
        setCustomBlocksMetadata(res2.data);
        setManifestChanged(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errTitle = `Failed to generate blocks manifest from ${blocksDirPath} !`;
        const errDescription = `${err.response?.data?.error ?? err.message}`;

        toast.message(errTitle, {
          description: errDescription.toString(),
          duration: 60000,
        });
      }
    },
    [setCustomBlockManifest, setCustomBlocksMetadata],
  );

  return {
    handleImportCustomBlocks,
    customBlockManifest,
    customBlocksMetadata,
  };
};
