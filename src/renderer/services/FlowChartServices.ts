import { Setting } from "../hooks/useSettings";
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "@/renderer/types";
import { Result } from "src/types/result";
import { captain } from "@/renderer/lib/ky";
import { HTTPError } from "ky";
import { RootNode, validateRootSchema } from "@/renderer/utils/ManifestLoader";
import { toast } from "sonner";
import { BlocksMetadataMap } from "@/renderer/types/blocks-metadata";
import { EnvVar } from "../types/envVar";

export const postEnvironmentVariable = async (
  body: EnvVar,
): Promise<Result<null, unknown>> => {
  try {
    await captain.post("env", { json: body });
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
    await captain.delete(`env/${key}`);

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

    captain.post("wfc", {
      json: {
        fc: fcStr,
        jobsetId: jobId,
        cancelExistingJobs: true,
        ...settings.reduce((obj, setting) => {
          //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
          obj[setting.key] = setting.value;
          return obj;
        }, {}),
      },
    });
  }
}

export function cancelFlowChartRun(
  rfInstance: ReactFlowJsonObject<ElementsData>,
  jobId: string,
) {
  if (rfInstance) {
    const fcStr = JSON.stringify(rfInstance);

    captain.post("cancel_fc", {
      json: {
        fc: fcStr,
        jobsetId: jobId,
      },
    });
  }
}

export async function getDeviceInfo(
  discoverNIDAQmxDevices = false,
  discoverNIDMMDevices = false,
) {
  const res = await captain.get("devices", {
    searchParams: {
      include_nidaqmx_drivers: discoverNIDAQmxDevices,
      include_nidmm_drivers: discoverNIDMMDevices,
    },
  });
  return res.json();
}

export const getManifest = async () => {
  try {
    const res = (await captain.get("blocks/manifest").json()) as RootNode;
    // TODO: fix zod schema to accept io directory structure
    const validateResult = validateRootSchema(res);
    if (!validateResult.success) {
      // toast.message(`Failed to validate blocks manifest with Zod schema!`, {
      //   duration: 20000,
      //   description: "Expand log to see more info...",
      // });
      // window.api?.sendLogToStatusbar("Zod validation error: ");
      // window.api?.sendLogToStatusbar(validateResult.error.message);
      console.error(validateResult.error);
    }
    return res;
  } catch (err: unknown) {
    if (err instanceof HTTPError) {
      const errTitle = "Failed to generate blocks manifest!";
      const errDescription = `${err.response.statusText ?? err.message}`;

      toast.message(errTitle, {
        description: errDescription.toString(),
        duration: 60000,
      });
      return null;
    }
  }
};

export const getBlocksMetadata = async () => {
  try {
    const res = await captain.get("blocks/metadata").json();
    return res as BlocksMetadataMap;
  } catch (err: unknown) {
    if (err instanceof HTTPError) {
      toast.message("Failed to generate blocks metadata", {
        description: err.response.statusText ?? err.message,
      });
      return null;
    }
  }
};

type LogLevel = {
  level: string;
};

export const getLogLevel = async () => {
  const res = (await captain.get("log_level").json()) as LogLevel;
  return res.level;
};

export const setLogLevel = async (level: string) => {
  await captain.post("log_level", { json: { level } });
};
