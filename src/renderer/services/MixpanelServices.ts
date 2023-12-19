import mixpanel from "mixpanel-browser";
import { Node } from "reactflow";

const PROJECT_TOKEN = "e89f03371825eaccda13079d584bff8e";
const enable = 1; // +(process?.env?.FLOJOY_ENABLE_TELEMETRY ?? "1");

export const initMixPanel = async () => {
  if (await isCI()) return;
  mixpanel.init(PROJECT_TOKEN);
};
export enum MixPanelEvents {
  setupStarted = "Setup started",
  setupComplete = "Setup Complete",
  flojoyLoaded = "Flojoy Loaded",
  setupError = "Setup Error",
  programRun = "Program Run",
  nodeDeleted = "Node Deleted",
  edgesChanged = "Edges Changed",
  canvasCleared = "Canvas cleared",
}

const isCI = async () => await window.api.isCI();

//for frontier, go to LOADER.py
export const sendProgramToMix = async (
  nodes: Node[],
  runProgram = false,
  saveProgram = true,
) => {
  if (await isCI()) return;
  if (nodes && enable) {
    const nodeList = JSON.stringify(nodes.map((node) => node.data.label));
    if (saveProgram) {
      sendMultipleDataEventToMix(
        "Program Saved",
        [nodeList, "disk"],
        ["nodeList", "savedTo"],
      );
    }
    if (runProgram) {
      sendEventToMix(MixPanelEvents.programRun, nodeList, "nodeList");
    }
  }
};

export const sendEventToMix = async (
  event: MixPanelEvents | string,
  data?: Record<string, unknown> | string,
  dataType: string = "data",
) => {
  if (await isCI()) return;
  if (enable) {
    try {
      mixpanel.track(
        event,
        typeof data === "string" ? { [dataType]: data } : data,
      );
    } catch (e) {
      console.error(`the request failed: ${e}`);
    }
  }
};

//pre-condition: the input array of data and dataType must be the same size
export const sendMultipleDataEventToMix = async (
  event: string,
  data: string[],
  dataType = ["data"],
) => {
  if (await isCI()) return;
  if (enable) {
    try {
      const obj = {};
      for (let i = 0; i < data.length; i++) {
        obj[dataType[i]] = data[i];
      }
      mixpanel.track(event, obj);
    } catch (e) {
      console.error(`the request failed: ${e}`);
    }
  }
};
