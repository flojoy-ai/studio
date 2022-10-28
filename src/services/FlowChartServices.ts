import { FlowExportObject } from "react-flow-renderer";
import localforage from "localforage";
const flowKey = "flow-joy";

export function saveFlowChartToLocalStorage(
  rfInstance?: FlowExportObject<any>
) {
  console.warn("saveFlowChartToLocalStorage:", rfInstance);
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export function saveAndRunFlowChartInServer(
  rfInstance?: FlowExportObject<any>
) {
  if (!rfInstance) {
    return;
  }

    const rfInstanceObject = rfInstance ;
    
    const fcStr = JSON.stringify(rfInstanceObject);

  fetch("http://localhost:5000/wfc", {
    method: "POST",
    body: JSON.stringify({ fc: fcStr }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((resp) => resp.json())
    .then((json) => console.log(json));
}
