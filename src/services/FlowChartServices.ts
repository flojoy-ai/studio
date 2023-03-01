import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";

import { CustomError } from "../utils/CustomError";

const flowKey = "flow-joy";

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  // console.warn("saveFlowChartToLocalStorage:", rfInstance);
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export async function saveAndRunFlowChartInServer({
  rfInstance,
  jobId,
}: {
  rfInstance?: ReactFlowJsonObject;
  jobId: string;
}) {
  if (rfInstance) {
    const rfInstanceObject = rfInstance;
    // console.log("saving flowchart to server:", rfInstanceObject);
    const fcStr = JSON.stringify(rfInstanceObject);

    fetch("/wfc", {
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

    fetch("/cancel_fc", {
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
