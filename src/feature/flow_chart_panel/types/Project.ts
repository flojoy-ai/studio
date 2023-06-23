import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "./CustomNodeProps";

export type Project = {
  ref: string;
  name: string;
  rfInstance: ReactFlowJsonObject<ElementsData, any>;
};

export type ProjectWithoutData = Omit<Project, "rfInstance">;
