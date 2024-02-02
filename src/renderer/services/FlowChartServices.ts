import { Setting } from "../hooks/useSettings";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@src/types";
import { Result } from "src/types/result";
import { baseClient } from "@src/lib/base-client";
import { RootNode, validateRootSchema } from "@src/utils/ManifestLoader";
import { toast } from "sonner";
import { BlocksMetadataMap } from "@src/types/blocks-metadata";

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
    return { ok: true, value: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { ok: false, error: error.response?.data ?? error.message };
  }
};

export const deleteEnvironmentVariable = async (
  key: string,
): Promise<Result<null, unknown>> => {
  try {
    await baseClient.delete(`env/${key}`);

    return { ok: true, value: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { ok: false, error: error.response?.data ?? error.message };
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

export async function getDeviceInfo(discoverNIDAQmxDevices = false, discoverNIDMMDevices = false) {
  const res = await baseClient.get("devices", {
    params: {
      include_nidaqmx_drivers: discoverNIDAQmxDevices,
      include_nidmm_drivers: discoverNIDMMDevices,
    },
  });
  return res.data;
}

export const getManifest = async () => {
  try {
    const res = await baseClient.get("blocks/manifest");
    // TODO: fix zod schema to accept io directory structure
    const validateResult = validateRootSchema(res.data);
    if (!validateResult.success) {
      // toast.message(`Failed to validate blocks manifest with Zod schema!`, {
      //   duration: 20000,
      //   description: "Expand log to see more info...",
      // });
      // window.api?.sendLogToStatusbar("Zod validation error: ");
      // window.api?.sendLogToStatusbar(validateResult.error.message);
      console.error(validateResult.error);
    }
    return res.data as RootNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const errTitle = "Failed to generate blocks manifest!";
    const errDescription = `${err.response?.data?.error ?? err.message}`;

    toast.message(errTitle, {
      description: errDescription.toString(),
      duration: 60000,
    });
    return null;
  }
};

export const getBlocksMetadata = async () => {
  try {
    const res = await baseClient.get("blocks/metadata");
    return res.data as BlocksMetadataMap;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.message("Failed to generate blocks metadata", {
      description: err.response?.data?.error ?? err.message,
    });
    return null;
  }
};

type LogLevel = {
  level: string;
};

export const getLogLevel = async () => {
  const res = await baseClient.get("log_level");
  const data = res.data as LogLevel;
  return data.level;
};

export const setLogLevel = async (level: string) => {
  await baseClient.post("log_level", { level });
};
