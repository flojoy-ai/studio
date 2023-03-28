import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";

const flowKey = "flow-joy";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = +process.env.REACT_APP_BACKEND_PORT! || 8000;
const API_URI = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  // console.warn("saveFlowChartToLocalStorage:", rfInstance);
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export function saveAndRunFlowChartInServer({
  rfInstance,
  jobId,
}: {
  rfInstance?: ReactFlowJsonObject;
  jobId: string;
}) {
  if (rfInstance) {
    const rfInstanceObject = rfInstance;
    const fcStr = JSON.stringify(rfInstanceObject);

    fetch(`${API_URI}/wfc`, {
      method: "POST",
      body: JSON.stringify({
        fc: fcStr,
        jobsetId: jobId,
        cancelExistingJobs: true,
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((resp) => resp.json())
      .then((json) => console.log(json));
  }
}

export function cancelFlowChartRun({
  rfInstance,
  jobId,
}: {
  rfInstance: ReactFlowJsonObject;
  jobId: string;
}) {
  if (rfInstance) {
    const rfInstanceObject = rfInstance;
    const fcStr = JSON.stringify(rfInstanceObject);

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
