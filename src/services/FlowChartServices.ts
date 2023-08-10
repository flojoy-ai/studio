import { Setting } from "../hooks/useSettings";
import localforage from "localforage";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";
import { API_URI } from "@src/data/constants";
import { Result } from "@src/types/result";

const flowKey = "flow-joy";

// Note that you have to update the nodes/edges of the
// flow chart instance manually before calling these functions.
// This is to prevent unnecessary re-rendering which would happen
// if the flow chart instance was updated every single time nodes/edges
// changed (for example with a useEffect).

export type EnvVar = {
  key: string;
  value: string;
};

export function saveFlowChartToLocalStorage(rfInstance?: ReactFlowJsonObject) {
  if (rfInstance) {
    const flowObj = rfInstance;
    localforage.setItem(flowKey, flowObj);
  }
}

export const postEnvironmentVariable = async (
  body: EnvVar,
): Promise<Result<null, unknown>> => {
  try {
    const response = await fetch(`${API_URI}/env/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return { ok: true, data: null };
    }
  } catch (error) {
    return { ok: false, error: error };
  }
  return { ok: false, error: "Something went wrong" };
};

export const deleteEnvironmentVariable = async (
  key: string,
): Promise<Result<null, unknown>> => {
  try {
    const response = await fetch(`${API_URI}/env/${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { ok: true, data: null };
    }
  } catch (error) {
    return { ok: false, error: error };
  }
  return { ok: false, error: "Something went wrong" };
};

export function saveAndRunFlowChartInServer({
  rfInstance,
  jobId,
  settings,
}: {
  rfInstance?: ReactFlowJsonObject<ElementsData>;
  jobId: string;
  settings: Setting[];
}) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    fetch(`${API_URI}/wfc`, {
      method: "POST",
      body: JSON.stringify({
        fc: fcStr,
        jobsetId: jobId,
        cancelExistingJobs: true,
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
  jobId: string,
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
