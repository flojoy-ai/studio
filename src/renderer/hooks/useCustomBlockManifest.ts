import { captain } from "@/renderer/lib/ky";
import {
  BlockMetadata,
  BlockManifest,
  blockManifestSchema,
} from "@/renderer/types/manifest";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { toast } from "sonner";
import { manifestChangedAtom } from "./useManifest";

// undefined = loading state
const customBlockManifestAtom = atom<BlockManifest | undefined | null>(null);
const customBlocksMetadataMapAtom = atom<BlockMetadata | undefined | null>(
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
        const res = await captain
          .get(`blocks/manifest?blocks_path=${blocksDirPath}`)
          .json();
        const validateResult = blockManifestSchema.safeParse(res);
        if (!validateResult.success) {
          // toast.message(`Failed to validate blocks manifest with Zod schema!`, {
          //   duration: 20000,
          //   description: "Expand log to see more info...",
          // });
          // window.api?.sendLogToStatusbar("Zod validation error: ");
          // window.api?.sendLogToStatusbar(validateResult.error.message);
          console.error(validateResult.error);
          return;
        }
        setCustomBlockManifest(validateResult.data);
        window.api.cacheCustomBlocksDir(blocksDirPath);
        const res2 = await captain
          .get("blocks/metadata", {
            searchParams: {
              blocks_path: blocksDirPath,
              custom_dir_changed: !startup,
            },
          })
          .json();
        setCustomBlocksMetadata(res2 as BlockMetadata);
        setManifestChanged(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errTitle = `Failed to generate blocks metadata from ${blocksDirPath} !`;
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
