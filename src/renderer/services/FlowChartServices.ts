import { Node, Edge } from "reactflow";
import { BlockData } from "@/renderer/types";
import { Result, fromPromise } from "@/types/result";
import { captain } from "@/renderer/lib/ky";
import { EnvVar } from "@/renderer/types/envVar";
import _ from "lodash";
import { Setting } from "@/renderer/stores/settings";
import { KyResponse } from "ky";

export const postEnvironmentVariable = async (
  body: EnvVar,
): Promise<Result<KyResponse>> => {
  return await fromPromise(captain.post("env", { json: body }));
};

export const deleteEnvironmentVariable = async (
  key: string,
): Promise<Result<KyResponse>> => {
  return await fromPromise(captain.delete(`env/${key}`));
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
