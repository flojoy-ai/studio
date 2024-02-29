import { captain } from "./ky";
import { HTTPError, KyResponse } from "ky";
import {
  BlockManifest,
  BlockMetadata,
  blockManifestSchema,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import { fromPromise, tryCatchPromise, tryParse } from "@/types/result";
import { Result } from "@/types/result";
import { ZodError } from "zod";
import { EnvVar } from "@/renderer/types/envVar";
import { BlockData } from "@/renderer/types/node";
import { Edge, Node } from "reactflow";
import { BackendSettings } from "@/renderer/stores/settings";
import _ from "lodash";

export const getManifest = async (): Promise<
  Result<BlockManifest, Error | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/manifest").json(),
  );
  return res.andThen(tryParse(blockManifestSchema));
};

export const getMetadata = async (): Promise<
  Result<BlockMetadata, Error | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/metadata").json(),
  );
  return res.andThen(tryParse(blockMetadataSchema));
};

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
}: RunFlowchartArgs): Promise<Result<KyResponse>> => {
  return await fromPromise(
    captain.post("wfc", {
      json: {
        fc: JSON.stringify({ nodes, edges }),
        jobsetId: jobId,
        cancelExistingJobs: true,
        //IMPORTANT: if you want to add more backend settings, modify PostWFC pydantic model in backend, otherwise you will get 422 error
        ..._.mapValues(settings, (s) => s.value),
      },
    }),
  );
};

export async function cancelFlowchartRun(jobId: string) {
  return await fromPromise(
    captain.post("cancel_fc", {
      json: {
        jobsetId: jobId,
      },
    }),
  );
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
