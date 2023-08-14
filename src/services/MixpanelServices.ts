import mixpanel from "mixpanel-browser";
import { Node } from "reactflow";
const PROJECT_TOKEN = "e89f03371825eaccda13079d584bff8e";
const enable = false;
//const enable = +(process.env.FLOJOY_ENABLE_TELEMETRY ?? "1");

export const sendFrontEndLoadsToMix = () => {
  if (enable) {
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
  }
};
//for frontier, go to LOADER.py
export const sendProgramToMix = (
  nodes: Node[],
  runProgram = false,
  saveProgram = true
) => {
  if (nodes && enable) {
    const nodeList = JSON.stringify(nodes.map((node) => node.data.label));
    if (saveProgram) {
      sendMultipleDataEventToMix(
        "Program Saved",
        [nodeList, "disk"],
        ["nodeList", "savedTo"]
      );
    }
    if (runProgram) {
      sendEventToMix("Program Run", nodeList, "nodeList");
    }
  }
};

export const sendEventToMix = (
  Event: string,
  data: string,
  dataType = "data"
) => {
  if (enable) {
    try {
      mixpanel.track(Event, { [dataType]: data });
    } catch (e) {
      console.error(`the request failed: ${e}`);
    }
  }
};

//pre-condition: the input array of data and dataType must be the same size
export const sendMultipleDataEventToMix = (
  Event: string,
  data: string[],
  dataType = ["data"]
) => {
  if (enable) {
    try {
      const obj = {};
      for (let i = 0; i < data.length; i++) {
        obj[dataType[i]] = data[i];
      }
      mixpanel.track(Event, obj);
    } catch (e) {
      console.error(`the request failed: ${e}`);
    }
  }
};
