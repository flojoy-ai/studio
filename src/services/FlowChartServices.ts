import { Settings } from "@src/hooks/useSettings";
import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";
import { notifications } from "@mantine/notifications";

import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";

const flowKey = "flow-joy";
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
// const BACKEND_PORT = process.env.VITE_BACKEND_PORT
//   ? Number(process.env.VITE_BACKEND_PORT)
//   : 8000;
const BACKEND_PORT = +process.env.VITE_BACKEND_PORT! || 8000;
const API_URI = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;

// Note that you have to update the nodes/edges of the
// flow chart instance manually before calling these functions.
// This is to prevent unnecessary re-rendering which would happen
// if the flow chart instance was updated every single time nodes/edges
// changed (for example with a useEffect).

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  // console.warn("saveFlowChartToLocalStorage:", rfInstance);
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export const sendApiKeyToDjango = async (body: object, endpoint: string) => {
  try {
    const response = await fetch(`${API_URI}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const responseData = await response.json();
      notifications.update({
        id: "set-api-key",
        title: "Successful!",
        message: "Successfully set the API Key",
        autoClose: 5000,
      });
    } else {
      notifications.update({
        id: "set-api-key",
        title: "Failed!",
        message: "Failed to set the API Key",
        autoClose: 5000,
      });
    }
  } catch (error) {
    notifications.update({
      id: "set-api-key",
      title: "Failed!",
      message: "Failed to set the API Key",
      autoClose: 5000,
    });
  }
};

export function saveAndRunFlowChartInServer({
  rfInstance,
  jobId,
  settings,
}: {
  rfInstance?: ReactFlowJsonObject<ElementsData, any>;
  jobId: string;
  settings: Settings[];
}) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    fetch(`${API_URI}/wfc`, {
      method: "POST",
      body: JSON.stringify({
        fc: fcStr,
        jobsetId: jobId,
        cancelExistingJobs: true,
        extraParams: settings.reduce((obj, setting) => {
          obj[setting.key] = setting.value;
          return obj;
        }, {}),
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
