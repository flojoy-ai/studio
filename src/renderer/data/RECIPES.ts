import { ElementsData } from "@src/types";
import { ReactFlowJsonObject, Node } from "reactflow";
import { defaultApp } from "./apps";

export const NOISY_SINE =
  defaultApp.rfInstance as ReactFlowJsonObject<ElementsData>;

export const bruh = defaultApp.rfInstance.nodes[0].data as ElementsData;

export const EMPTY_CANVAS = {
  elements: [],
  position: [0, 0],
  zoom: 0.8,
};
