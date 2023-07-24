import { Settings } from "@src/hooks/useSettings";
import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";
import { notifications } from "@mantine/notifications";

import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { API_URI } from "@src/data/constants";

const flowKey = "flow-joy";

// Note that you have to update the nodes/edges of the
// flow chart instance manually before calling these functions.
// This is to prevent unnecessary re-rendering which would happen
// if the flow chart instance was updated every single time nodes/edges
// changed (for example with a useEffect).

export type CLOUD_OPENAI_TYPE = {
  key: string;
};

export type S3_TYPE = {
  name: string;
  accessKey: string;
  secretKey: string;
};

export type API_TYPE = CLOUD_OPENAI_TYPE | S3_TYPE;

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export const sendApiKeyToDjango = async (body: API_TYPE, endpoint: string) => {
  try {
    const response = await fetch(`${API_URI}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      await response.json();
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
  rfInstance?: ReactFlowJsonObject<ElementsData>;
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
        precompile: true,
        ...settings.reduce((obj, setting) => {
          //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
          obj[setting.key] = setting.value;
          return obj;
        }, {}),
      }),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
  }
}

export function cancelFlowChartRun(
  rfInstance: ReactFlowJsonObject<ElementsData>,
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
