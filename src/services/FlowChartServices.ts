import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";

import { CustomError } from "../utils/CustomError";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { ParamValueType } from "@feature/common/types/ParamValueType";

const flowKey = "flow-joy";
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
const BACKEND_PORT = process.env.VITE_BACKEND_PORT
  ? Number(process.env.VITE_BACKEND_PORT)
  : 8000;
const API_URI = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;

// Note that you have to update the nodes/edges of the
// flow chart instance manually before calling these functions.
// This is to prevent unnecessary re-rendering which would happen
// if the flow chart instance was updated every single time nodes/edges
// changed (for example with a useEffect).

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  // console.warn("saveFlowChartToLocalStorage:", rfInstance);
  console.log("saving");
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export const sendApiKeyToDjango = async (apiKey: string) => {
  try {
    const response = await fetch(`${API_URI}/api/set-api`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: apiKey }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      console.error("Request failed:", response.status);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
export function saveAndRunFlowChartInServer(
  jobId: string,
  rfInstance?: ReactFlowJsonObject<ElementsData, any>
) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    fetch(`${API_URI}/wfc`, {
      method: "POST",
      body: JSON.stringify({
        fc: fcStr,
        jobsetId: jobId,
        cancelExistingJobs: true,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  }
}

export function cancelFlowChartRun(
  rfInstance: ReactFlowJsonObject<ElementsData, any>,
  jobId: string
) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    fetch(`${API_URI}/cancel_fc`, {
      method: "POST",
      body: JSON.stringify({
        fc: fcStr,
        jobsetId: jobId,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((resp) => resp.json())
      .then((json) => console.log(json));
  }
}
