import { getManifest, getNodesMetadata } from "@src/services/FlowChartServices";
import { NodesMetadataMap } from "@src/types/nodes-metadata";
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

const nodesMetadataMapAtom = atom<NodesMetadataMap | null>(null);

export const useFetchNodesMetadata = () => {
  const setNodesMetadata = useSetAtom(nodesMetadataMapAtom);

  return useCallback(async () => {
    setNodesMetadata(null);
    const manifest = await getNodesMetadata();
    setNodesMetadata(manifest);
  }, [setNodesMetadata]);
};

export const useNodesMetadata = () => useAtomValue(nodesMetadataMapAtom);
