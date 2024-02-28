import { BlockMetadata, RootNode } from "@/renderer/types/manifest";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useCustomSections } from "./useCustomBlockManifest";
import { getManifest, getMetadata } from "@/renderer/lib/api";
import { toast } from "sonner";
import { HTTPError } from "ky";
import { ZodError } from "zod";

// TODO: Rewrite this

// undefined = loading state
const manifestAtom = atom<RootNode | undefined | null>(null);
export const manifestChangedAtom = atom<boolean>(true);

export const useFetchManifest = () => {
  const setManifest = useSetAtom(manifestAtom);

  return useCallback(async () => {
    setManifest(undefined);
    const res = await getManifest();

    if (!res.ok) {
      if (res.error instanceof HTTPError) {
        toast.error("Failed to fetch block manifest", {
          description: res.error.message,
        });
      } else if (res.error instanceof ZodError) {
        toast.error("Failed to validate block manifest.");
        console.error(res.error.message);
      }
      return;
    }

    setManifest(res.value);
  }, [setManifest]);
};

export const useManifest = () => useAtomValue(manifestAtom);

const nodesMetadataMapAtom = atom<BlockMetadata | undefined | null>(null);

export const useFetchNodesMetadata = () => {
  const setNodesMetadata = useSetAtom(nodesMetadataMapAtom);

  return useCallback(async () => {
    setNodesMetadata(undefined);
    const res = await getMetadata();

    if (!res.ok) {
      if (res.error instanceof HTTPError) {
        toast.error("Failed to fetch block metadata", {
          description: res.error.message,
        });
      } else if (res.error instanceof ZodError) {
        toast.error("Failed to validate block metadata.");
        console.error(res.error.message);
      }
      return;
    }

    setNodesMetadata(res.value);
  }, [setNodesMetadata]);
};

export const useNodesMetadata = () => useAtomValue(nodesMetadataMapAtom);

export const useFullManifest = () => {
  const manifest = useManifest();
  const { customBlockManifest } = useCustomSections();

  return useMemo(() => {
    if (manifest === undefined || customBlockManifest === undefined) {
      return undefined;
    }
    if (manifest === null) {
      return null;
    }

    return customBlockManifest
      ? {
          ...manifest,
          children: manifest.children.concat(customBlockManifest.children),
        }
      : manifest;
  }, [manifest, customBlockManifest]);
};

export const useFullMetadata = () => {
  const nodesMetadataMap = useNodesMetadata();
  const { customBlocksMetadata } = useCustomSections();

  return useMemo(() => {
    const html = document.getElementsByTagName("html")[0];
    if (nodesMetadataMap === undefined || customBlocksMetadata === undefined) {
      html.removeAttribute("data-blockmetadata");
      return undefined;
    }
    if (nodesMetadataMap === null) {
      return null;
    }
    html.setAttribute("data-blockmetadata", "true");

    return customBlocksMetadata
      ? {
          ...nodesMetadataMap,
          ...customBlocksMetadata,
        }
      : nodesMetadataMap;
  }, [nodesMetadataMap, customBlocksMetadata]);
};
