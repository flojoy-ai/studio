import { FlowExportObject } from "react-flow-renderer";
import localforage from "localforage";

import { CustomError } from "../utils/CustomError";

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

export async function saveAndRunFlowChartInServer({
  rfInstance,
  jobId,
}: {
  rfInstance?: FlowExportObject<any>;
  jobId: string;
}) {
  if (rfInstance) {

    const fcStr = JSON.stringify(rfInstance);

    let data = await fetch("/wfc", {
      method: "POST",
      body: JSON.stringify({ fc: fcStr, jobsetId:jobId, cancelExistingJobs: true}),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    if(data.ok){
      data = await data.json()
      console.log(data)
      return data
    }
    else{
      throw new CustomError({statusCode:data.status,statusMessage:data.statusText})
    }
  }
}
