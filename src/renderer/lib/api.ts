import { captain } from "./ky";
import { HTTPError } from "ky";
import {
  blockManifestSchema,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import { tryParse } from "@/types/result";
import { z } from "zod";
import { EnvVar } from "@/renderer/types/envVar";
import { BlockData } from "@/renderer/types/block";
import { Edge, Node } from "reactflow";
import { BackendSettings } from "@/renderer/stores/settings";
import _ from "lodash";
import { fromPromise } from "neverthrow";

export const getManifest = (blocksPath?: string) => {
  const searchParams = blocksPath
    ? {
        blocks_path: blocksPath,
      }
    : undefined;

  return fromPromise(
    captain
      .get("blocks/manifest", {
        searchParams,
      })
      .json(),
    (e) => e as HTTPError,
  ).andThen(tryParse(blockManifestSchema));
};

export const getMetadata = (
  blocksPath?: string,
  customDirChanged: boolean = false,
) => {
  const searchParams = blocksPath
    ? {
        blocks_path: blocksPath,
        custom_dir_changed: customDirChanged,
      }
    : undefined;

  return fromPromise(
    captain.get("blocks/metadata", { searchParams }).json(),
    (e) => e as HTTPError,
  ).andThen(tryParse(blockMetadataSchema));
};

export const postEnvironmentVariable = async (body: EnvVar) => {
  return fromPromise(
    captain.post("env", { json: body }),
    (e) => e as HTTPError,
  );
};

export const deleteEnvironmentVariable = async (key: string) => {
  return fromPromise(captain.delete(`env/${key}`), (e) => e as HTTPError);
};

type RunFlowchartArgs = {
  nodes: Node<BlockData>[];
  edges: Edge[];
  jobId: string;
  settings: BackendSettings;
};

export const runFlowchart = async ({
  nodes,
  edges,
  settings,
  jobId,
}: RunFlowchartArgs) => {
  return fromPromise(
    captain.post("wfc", {
      json: {
        fc: JSON.stringify({ nodes, edges }),
        jobsetId: jobId,
        cancelExistingJobs: true,
        //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
        ..._.mapValues(settings, (s) => s.value),
      },
    }),
    (e) => e as HTTPError,
  );
};

export async function cancelFlowchartRun(jobId: string) {
  return fromPromise(
    captain.post("cancel_fc", {
      json: {
        jobsetId: jobId,
      },
    }),
    (e) => e as HTTPError,
  );
}

export async function getDeviceInfo(
  discoverNIDAQmxDevices = false,
  discoverNIDMMDevices = false,
) {
  return fromPromise(
    captain
      .get("devices", {
        searchParams: {
          include_nidaqmx_drivers: discoverNIDAQmxDevices,
          include_nidmm_drivers: discoverNIDMMDevices,
        },
      })
      .json(),
    (e) => e as HTTPError,
  );
}

type LogLevel = {
  level: string;
};

const LogLevel = z.object({
  level: z.string(),
});

export const getLogLevel = async () => {
  return fromPromise(captain.get("log_level").json(), (e) => e as HTTPError)
    .andThen(tryParse(LogLevel))
    .map((v) => v.level);
};

export const setLogLevel = async (level: string) => {
  return fromPromise(
    captain.post("log_level", { json: { level } }),
    (e) => e as HTTPError,
  );
};
