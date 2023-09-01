import { Setting } from "../hooks/useSettings";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@/types";
import { Result } from "@src/types/result";
import { baseClient } from "@src/lib/base-client";

// Note that you have to update the nodes/edges of the
// flow chart instance manually before calling these functions.
// This is to prevent unnecessary re-rendering which would happen
// if the flow chart instance was updated every single time nodes/edges
// changed (for example with a useEffect).

export type EnvVar = {
  key: string;
  value: string;
};

export const postEnvironmentVariable = async (
  body: EnvVar,
): Promise<Result<null, unknown>> => {
  try {
    await baseClient.post("env", body);
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error };
  }
};

export const deleteEnvironmentVariable = async (
  key: string,
): Promise<Result<null, unknown>> => {
  try {
    await baseClient.delete(`env/${key}`);

    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error };
  }
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

    baseClient.post("wfc", {
      fc: fcStr,
      jobsetId: jobId,
      cancelExistingJobs: true,
      ...settings.reduce((obj, setting) => {
        //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
        obj[setting.key] = setting.value;
        return obj;
      }, {}),
    });
  }
}

export function cancelFlowChartRun(
  rfInstance: ReactFlowJsonObject<ElementsData>,
  jobId: string,
) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    baseClient
      .post("cancel_fc", {
        fc: fcStr,
        jobsetId: jobId,
      })
      .then((res) => console.log(res.data));
  }
}
