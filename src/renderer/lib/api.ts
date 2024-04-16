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
import {
  TestDiscoverContainer,
  TestSequenceContainer,
} from "@/renderer/types/test-sequencer";

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
  observeBlocks: string[];
  jobId: string;
  settings: BackendSettings;
};

export const runFlowchart = async ({
  nodes,
  edges,
  observeBlocks,
  settings,
  jobId,
}: RunFlowchartArgs) => {
  return fromPromise(
    captain.post("wfc", {
      json: {
        fc: JSON.stringify({ nodes, edges }),
        jobsetId: jobId,
        cancelExistingJobs: true,
        observeBlocks: observeBlocks,
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

const User = z.object({
  email: z.string(),
});

export type User = z.infer<typeof User>;

export const getCloudUser = (
  workspace_secret: string | undefined = undefined,
) => {
  if (workspace_secret) {
    return get("cloud/user", User, {
      headers: {
        secret: workspace_secret,
      },
    });
  } else {
    return get("cloud/user", User);
  }
};

const Part = z.object({
  partId: z.string(),
  partVariationId: z.string(),
  partNumber: z.string(),
  description: z.string(),
});

export type Part = z.infer<typeof Part>;

const Project = z.object({
  label: z.string(),
  value: z.string(),
  repoUrl: z.string().nullable(),
  part: Part,
  productName: z.string(),
});
export type Project = z.infer<typeof Project>;
export const getCloudProjects = () =>
  get("cloud/projects", Project.array(), { timeout: 60000 });

const Station = z.object({
  label: z.string(),
  value: z.string(),
});
export type Station = z.infer<typeof Station>;
export const getCloudStations = (projectId: string) =>
  get(`cloud/stations/${projectId}`, Station.array(), { timeout: 60000 });

const Unit = z.object({
  serialNumber: z.string(),
  partVariationId: z.string(),
  lotNumber: z.string().nullable(),
});
export type Unit = z.infer<typeof Unit>;
export const getCloudUnits = (partId: string) =>
  get(`cloud/partVariation/${partId}/unit`, Unit.array(), { timeout: 60000 });

export const postSession = (
  serialNumber: string,
  stationId: string,
  integrity: boolean,
  aborted: boolean,
  commitHash: string,
  cycleRuns: TestSequenceContainer[][],
) => {
  const measurements: Measurement[] = [];
  console.log(cycleRuns);
  cycleRuns.forEach((cycle, cycleNumber) => {
    cycle.forEach((seqContainer) => {
      seqContainer.elements.forEach((elem) => {
        if (
          elem.type === "test" &&
          elem.status !== "pending" &&
          elem.status !== "running" &&
          elem.exportToCloud
        ) {
          measurements.push({
            testId: elem.id,
            sequenceName: seqContainer.project.name,
            cycleNumber: cycleNumber,
            name: elem.testName,
            pass_: elem.status === "pass",
            completionTime: elem.completionTime ? elem.completionTime : 0,
            createdAt: elem.createdAt!,
          });
        }
      });
    });
  });

  const body: Session = {
    serialNumber,
    stationId,
    integrity,
    aborted: aborted,
    notes: "",
    commitHash,
    measurements,
  };

  console.log(JSON.stringify(body));
  return captain.post("cloud/session", { json: body }).json();
};

const Measurement = z.object({
  testId: z.string(),
  sequenceName: z.string(),
  cycleNumber: z.number(),
  name: z.string(),
  // data: Is handle in the backend
  pass_: z.boolean().optional(),
  completionTime: z.number(),
  createdAt: z.string(),
});
export type Measurement = z.infer<typeof Measurement>;

const Session = z.object({
  serialNumber: z.string(),
  stationId: z.string(),
  integrity: z.boolean(),
  aborted: z.boolean(),
  notes: z.string(),
  commitHash: z.string(),
  measurements: Measurement.array(),
});
export type Session = z.infer<typeof Session>;

export const getCloudHealth = (url: string | undefined = undefined) => {
  let options: Options = {};
  if (url) {
    options = { headers: { url: url } };
  }
  return fromPromise(
    captain.get("cloud/health", options),
    (e) => e as HTTPError,
  );
};

const TestProfile = z.object({
  profile_root: z.string(),
  hash: z.string(),
});
export type TestProfile = z.infer<typeof TestProfile>;

export const installTestProfile = (url: string) => {
  let options: Options = { headers: { url: url }, timeout: 60000 };
  return get("test_profile/install", TestProfile, options);
};
