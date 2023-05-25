import mixpanel from "mixpanel-browser";
import { Node } from "reactflow";
const PROJECT_TOKEN = "e89f03371825eaccda13079d584bff8e";

type savedLocation = "disk" | "frontier";
export const sendFrontEndLoadsToMix = () => {
  try {
    mixpanel.init(PROJECT_TOKEN, {
      debug: true,
      loaded: function () {
        mixpanel.track("Flojoy Loaded");
      },
    });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

export const sendProgramRunToMix = (nodes: Node[]) => {
  try {
    const instanceLabel = JSON.stringify(nodes.map((node) => node.data.label));
    mixpanel.track("Program Run", { nodeList: instanceLabel });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

//for frontier, you need python stuff, got to LOADER.py
export const sendProgramSavedToMix = (nodes: Node[], saved: savedLocation) => {
  try {
    const instanceLabel = JSON.stringify(nodes.map((node) => node.data.label));
    mixpanel.track("Program Saved", {
      nodeList: instanceLabel,
      savedTo: saved,
    });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
export const sendNodeDeletedToMix = (node: string) => {
  try {
    mixpanel.track("Node Deleted", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

export const sendNodeAddedToMix = (node: string) => {
  try {
    mixpanel.track("Node Added", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

export const sendTabChangedToMix = (changedTab: string) => {
  try {
    mixpanel.track("Tab Changed", { tab: changedTab });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
export const sendNodeSearchedToMix = (node: string) => {
  try {
    mixpanel.track("Node Searched", { nodeTitle: node });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};
