import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BlockManifest, BlockMetadata } from "@/renderer/types/manifest";
import { Ok, Result } from "@/types/result";
import { getManifest, getMetadata } from "@/renderer/lib/api";
import { HTTPError } from "ky";
import { ZodError } from "zod";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

type State = {
  standardBlocksManifest: BlockManifest | undefined;
  customBlocksManifest: BlockManifest | undefined | null;
  standardBlocksMetadata: BlockMetadata | undefined;
  customBlocksMetadata: BlockMetadata | undefined | null;
  manifestChanged: boolean;
};

type Actions = {
  fetchManifest: () => Promise<Result<void>>;
  importCustomBlocks: (
    startup: boolean,
  ) => Promise<Result<void, HTTPError | ZodError | Error>>;
  setManifestChanged: (val: boolean) => void;
};

export const useManifestStore = create<State & Actions>()(
  immer((set, get) => ({
    standardBlocksManifest: undefined,
    customBlocksManifest: undefined,
    standardBlocksMetadata: undefined,
    customBlocksMetadata: undefined,
    manifestChanged: true,

    fetchManifest: async () => {
      const r1 = await getManifest();
      if (r1.isErr()) return r1;
      const r2 = await getMetadata();
      if (r2.isErr()) return r2;

      set({
        standardBlocksManifest: r1.value,
        standardBlocksMetadata: r2.value,
      });
      return Ok(undefined);
    },

    importCustomBlocks: async (startup: boolean) => {
      console.log("bruh");
      const blocksDirPath = !startup
        ? await window.api.pickDirectory()
        : await window.api.getCustomBlocksDir();

      if (!blocksDirPath) {
        if (get().customBlocksManifest !== undefined) return Ok(undefined);
        set({
          manifestChanged: true,
          customBlocksManifest: null,
          customBlocksMetadata: null,
        });
        return Ok(undefined);
      }

      const r1 = await getManifest(blocksDirPath);
      if (r1.isErr()) return r1;
      const r2 = await getMetadata(blocksDirPath, !startup);
      if (r2.isErr()) return r2;

      window.api.cacheCustomBlocksDir(blocksDirPath);
      set({
        manifestChanged: true,
        customBlocksManifest: r1.value,
        customBlocksMetadata: r2.value,
      });

      return Ok(undefined);
    },

    setManifestChanged: (val: boolean) => {
      set({ manifestChanged: val });
    },
  })),
);

export const useManifest = () => {
  const { manifest, customManifest } = useManifestStore(
    useShallow((state) => ({
      manifest: state.standardBlocksManifest,
      customManifest: state.customBlocksManifest,
    })),
  );

  return useMemo(() => {
    if (manifest === undefined || customManifest === undefined) {
      return undefined;
    }

    return customManifest
      ? {
          ...manifest,
          children: manifest.children.concat(customManifest.children),
        }
      : manifest;
  }, [manifest, customManifest]);
};

export const useMetadata = () => {
  const { metadata, customMetadata } = useManifestStore(
    useShallow((state) => ({
      metadata: state.standardBlocksMetadata,
      customMetadata: state.customBlocksMetadata,
    })),
  );

  return useMemo(() => {
    const html = document.getElementsByTagName("html")[0];
    if (metadata === undefined || customMetadata === undefined) {
      html.removeAttribute("data-blockmetadata");
      return undefined;
    }
    html.setAttribute("data-blockmetadata", "true");

    return customMetadata
      ? {
          ...metadata,
          ...customMetadata,
        }
      : metadata;
  }, [metadata, customMetadata]);
};
