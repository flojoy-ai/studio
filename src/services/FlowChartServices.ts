import { OnLoadParams } from "react-flow-renderer";
import localforage from "localforage";
const flowKey = "flow-joy";

export function saveFlowChartToLocalStorage(rfInstance?: OnLoadParams) {
  console.warn("saveFlowChartToLocalStorage:", rfInstance);
  if (rfInstance) {
    const flowObj = rfInstance.toObject();
    localforage.setItem(flowKey, flowObj);
  }
}

export function saveAndRunFlowChartInServer(rfInstance?: OnLoadParams){
    if (!rfInstance) {
        return;
    }

    const rfInstanceObject = rfInstance.toObject();
    console.log('saving flowchart to server:', rfInstanceObject);

    const fcStr = JSON.stringify(rfInstanceObject);

    fetch('/wfc', {
      method: 'POST',
      body: JSON.stringify({fc: fcStr}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then(resp => resp.json())
    .then(json => console.log(json));  
}