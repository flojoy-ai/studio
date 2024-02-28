import { Node, Edge } from "reactflow";
import { BlockData } from "@/renderer/types";
import { Result } from "src/types/result";
import { captain } from "@/renderer/lib/ky";
import { HTTPError } from "ky";
import { RootNode, validateRootSchema } from "@/renderer/utils/ManifestLoader";
import { toast } from "sonner";
import { BlockMetadataMap } from "@/renderer/types/blocks-metadata";
import { EnvVar } from "@/renderer/types/envVar";
import _ from "lodash";
import { Setting } from "@/renderer/stores/settings";

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

export function runFlowchart({
  nodes,
  edges,
  jobId,
  settings,
}: {
  nodes: Node<BlockData>[];
  edges: Edge[];
  jobId: string;
  settings: Record<string, Setting>;
}) {
  captain.post("wfc", {
    json: {
      fc: JSON.stringify({ nodes, edges }),
      jobsetId: jobId,
      cancelExistingJobs: true,
      //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
      ..._.mapValues(settings, (s) => s.value),
    },
  });
}

export function cancelFlowChartRun(jobId: string) {
  captain.post("cancel_fc", {
    json: {
      jobsetId: jobId,
    },
  });
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
    return res as BlockMetadataMap;
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
