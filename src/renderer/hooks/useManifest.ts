import {
  getManifest,
  getBlocksMetadata,
} from "@src/services/FlowChartServices";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";
import { RootNode } from "@src/utils/ManifestLoader";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

const manifestAtom = atom<RootNode | null>(null);

export const useFetchManifest = () => {
  const setManifest = useSetAtom(manifestAtom);

  return useCallback(async () => {
    setManifest(null);
    const manifest = await getManifest();
    setManifest(manifest);
  }, [setManifest]);
};

export const useManifest = () => useAtomValue(manifestAtom);

const nodesMetadataMapAtom = atom<BlocksMetadataMap | null>(null);

export const useFetchNodesMetadata = () => {
  const setNodesMetadata = useSetAtom(nodesMetadataMapAtom);

  return useCallback(async () => {
    setNodesMetadata(null);
    const manifest = await getBlocksMetadata();
    setNodesMetadata(manifest);
  }, [setNodesMetadata]);
};

export const useNodesMetadata = () => useAtomValue(nodesMetadataMapAtom);
