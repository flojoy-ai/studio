import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BlockManifest, BlockMetadata } from "@/renderer/types/manifest";
import { ok, Result, safeTry } from "neverthrow";
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
  fetchManifest: () => Promise<Result<void, HTTPError | ZodError>>;
  importCustomBlocks: (
    startup: boolean,
  ) => Promise<Result<void, HTTPError | ZodError>>;
  setManifestChanged: (val: boolean) => void;
};

// TODO: Fix eslint-plugin-neverthrow to allow this
// so that we can use the plugin for the whole codebase
export const useManifestStore = create<State & Actions>()(
  immer((set, get) => ({
    standardBlocksManifest: undefined,
    customBlocksManifest: undefined,
    standardBlocksMetadata: undefined,
    customBlocksMetadata: undefined,
    manifestChanged: true,

    fetchManifest: () => {
      return safeTry(async function* () {
        set({
          standardBlocksManifest: yield* (await getManifest()).safeUnwrap(),
          standardBlocksMetadata: yield* (await getMetadata()).safeUnwrap(),
        });
        return ok(undefined);
      });
    },

    importCustomBlocks: async (startup: boolean) => {
      const blocksDirPath = !startup
        ? await window.api.pickDirectory(false)
        : await window.api.getCustomBlocksDir();

      if (!blocksDirPath) {
        if (get().customBlocksManifest !== undefined) return ok(undefined);
        set({
          manifestChanged: true,
          customBlocksManifest: null,
          customBlocksMetadata: null,
        });
        return ok(undefined);
      }

      return safeTry(async function* () {
        const manifest = yield* (await getManifest(blocksDirPath)).safeUnwrap();
        const metadata = yield* (
          await getMetadata(blocksDirPath, !startup)
        ).safeUnwrap();
        set({
          manifestChanged: true,
          customBlocksManifest: manifest,
          customBlocksMetadata: metadata,
        });
        window.api.cacheCustomBlocksDir(blocksDirPath);
        return ok(undefined);
      });
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
