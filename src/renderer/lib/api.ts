import { captain } from "./ky";
import { HTTPError } from "ky";
import {
  blockManifestSchema,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import { tryParse } from "@/types/result";
import { ZodError, z } from "zod";
import { EnvVar } from "@/renderer/types/env-var";
import { BlockData } from "@/renderer/types/block";
import { Edge, Node } from "reactflow";
import { BackendSettings } from "@/renderer/stores/settings";
import _ from "lodash";
import { ResultAsync, fromPromise } from "neverthrow";
import { Options } from "ky";
import { DeviceInfo } from "@/renderer/types/hardware";
import { TestDiscoverContainer } from "@/renderer/types/test-sequencer";

const get = <Z extends z.ZodTypeAny>(
  url: string,
  schema: Z,
  options?: Options,
): ResultAsync<z.infer<Z>, HTTPError | ZodError> => {
  return fromPromise(
    captain.get(url, options).json(),
    (e) => e as HTTPError,
  ).andThen(tryParse(schema));
};

export const getManifest = (blocksPath?: string) => {
  const searchParams = blocksPath
    ? {
        blocks_path: blocksPath,
      }
    : undefined;

  return get("blocks/manifest", blockManifestSchema, { searchParams });
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

  return get("blocks/metadata", blockMetadataSchema, { searchParams });
};

export const getEnvironmentVariables = async () => get("env", EnvVar.array());

export const getEnvironmentVariable = async (key: string) =>
  get(`env/${key}`, EnvVar);

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
  return get("devices", DeviceInfo, {
    searchParams: {
      include_nidaqmx_drivers: discoverNIDAQmxDevices,
      include_nidmm_drivers: discoverNIDMMDevices,
    },
  });
}

const LogLevel = z.object({
  level: z.string(),
});

export const getLogLevel = async () => {
  return get("log_level", LogLevel).map((v) => v.level);
};

export const setLogLevel = async (level: string) => {
  return fromPromise(
    captain.post("log_level", { json: { level } }),
    (e) => e as HTTPError,
  );
};

export const discoverPytest = async (path: string, oneFile: boolean) => {
  return get("discover-pytest", TestDiscoverContainer, {
    searchParams: {
      path,
      oneFile,
    },
  });
};

const Project = z.object({
  label: z.string(),
  value: z.string(),
});

export type Project = z.infer<typeof Project>;

export const getCloudProjects = () => get("cloud/projects", Project.array());
