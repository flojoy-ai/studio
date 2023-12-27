import {
  getManifest,
  getBlocksMetadata,
} from "@src/services/FlowChartServices";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { RootNode } from "@src/utils/ManifestLoader";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useCustomSections } from "./useCustomBlockManifest";

// undefined = loading state
const manifestAtom = atom<RootNode | undefined | null>(null);
export const manifestChangedAtom = atom<boolean>(true);

export const useFetchManifest = () => {
  const setManifest = useSetAtom(manifestAtom);

  return useCallback(async () => {
    setManifest(undefined);
    const manifest = await getManifest();
    setManifest(manifest);
  }, [setManifest]);
};

export const useManifest = () => useAtomValue(manifestAtom);

const nodesMetadataMapAtom = atom<BlocksMetadataMap | undefined | null>(null);

export const useFetchNodesMetadata = () => {
  const setNodesMetadata = useSetAtom(nodesMetadataMapAtom);

  return useCallback(async () => {
    setNodesMetadata(undefined);
    const manifest = await getBlocksMetadata();
    setNodesMetadata(manifest);
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
