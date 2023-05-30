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

export const sendEventToMix = (
  Event: string,
  data: string,
  dataType = "data"
) => {
  try {
    mixpanel.track(Event, { [dataType]: data });
  } catch (e) {
    console.error(`the request failed: ${e}`);
  }
};

//@pre-condition: the input array of data and dataType must be the same size
export const sendMultipleDataEventToMix = (
  Event: string,
  data: string[],
  dataType = ["data"]
) => {
  try {
    const obj = {};
    for (let i = 0; i < data.length; i++) {
      obj[dataType[i]] = data[i];
    }
    mixpanel.track(Event, obj);
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
