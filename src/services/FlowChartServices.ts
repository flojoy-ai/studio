import { Setting } from "../hooks/useSettings";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@/types";
import { Result } from "@src/types/result";
import { baseClient } from "@src/lib/base-client";
import { RootNode, validateRootSchema } from "@src/utils/ManifestLoader";
import { toast } from "sonner";
import { NodesMetadataMap } from "@src/types/nodes-metadata";

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

export async function getDeviceInfo() {
  const res = await baseClient.get("devices");
  return res.data;
}

export const getManifest = async () => {
  try {
    const res = await baseClient.get("nodes/manifest");
    // TODO: fix zod schema to accept io directory structure
    const validateResult = validateRootSchema(res.data);
    if (!validateResult.success) {
      toast.message(`Failed to validate nodes manifest!`, {
        duration: 20000,
        description: "Check browser console for more info.",
      });
      console.error(validateResult.error);
    }
    return res.data as RootNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const errTitle = "Failed to generate nodes manifest!";
    const errDescription = `${err.response?.data?.error ?? err.message}`;

    toast.message(errTitle, {
      description: errDescription.toString(),
      duration: 60000,
    });
    return null;
  }
};

export const getNodesMetadata = async () => {
  try {
    const res = await baseClient.get("nodes/metadata");
    return res.data as NodesMetadataMap;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.message("Failed to generate nodes metadata", {
      description: err.response?.data?.error ?? err.message,
    });
    return null;
  }
};
