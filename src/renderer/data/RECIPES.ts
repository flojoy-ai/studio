import { BlockData } from "@/renderer/types/block";
import { ReactFlowJsonObject } from "reactflow";
import { defaultApp } from "./apps";

export const NOISY_SINE =
  defaultApp.rfInstance as ReactFlowJsonObject<BlockData>;

export const EMPTY_CANVAS = {
  elements: [],
  position: [0, 0],
  zoom: 0.8,
};
