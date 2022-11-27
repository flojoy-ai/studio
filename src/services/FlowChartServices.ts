import { FlowExportObject } from "react-flow-renderer";
import localforage from "localforage";
const flowKey = "flow-joy";

export function saveFlowChartToLocalStorage(
  rfInstance?: FlowExportObject<any>
) {
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
  rfInstance?: FlowExportObject<any>;
  jobId: string;
}) {
  if (!rfInstance) {
    return;
  }

  const rfInstanceObject = rfInstance;
  // console.log("saving flowchart to server:", rfInstanceObject);

  const fcStr = JSON.stringify(rfInstanceObject);

  fetch("/wfc", {
    method: "POST",
    body: JSON.stringify({ fc: fcStr, jobsetId:jobId }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((resp) => resp.json())
    .then((json) => console.log(json));
}
