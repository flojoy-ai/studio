import { z } from "zod";
import { BlockResult } from "./block-result";

export enum ServerStatus {
  // all the possible server status that can be received from the server
  STANDBY = "🐢 awaiting a new job",
  RUNNING_PYTHON_JOB = "🏃‍♀️ running python job: ",
  FAILED_BLOCK = "❌ Failed to run: ",
  RUN_PRE_JOB_OP = "⏳ running pre-job operation...",
  BUILDING_TOPOLOGY = " 🔨 building flow chart...",
  MAXIMUM_RUNTIME_EXCEEDED = "⏰ maximum runtime exceeded",
  COLLECTING_PIP_DEPENDENCIES = " 📦 collecting pip dependencies...",
  INSTALLING_PACKAGES = "✨ installing missing packages...",
  IMPORTING_BLOCK_FUNCTIONS = " 📦 importing node functions...",
  PRE_JOB_OP_FAILED = "❌ pre-job operation failed - Re-run script...",
  RUN_IN_PROCESS = "🏃‍♀️ running script...",
  IMPORTING_BLOCK_FUNCTIONS_FAILED = "❌ importing node functions failed",

  // some status we defined only on the client
  OFFLINE = "🛑 server offline",
  CONNECTING = "Connecting to server...",
}

export const ServerStatusEnum = z.nativeEnum(ServerStatus);
export type ServerStatusEnum = z.infer<typeof ServerStatusEnum>;

export const WorkerJobResponse = z.object({
  jobsetId: z.string().optional(),
  socketId: z.string().optional(),
  SYSTEM_STATUS: ServerStatusEnum.optional(),
  type: z.enum([
    "worker_response",
    "connection_established",
    "manifest_update",
  ]),
  FAILED_NODES: z.record(z.string()).optional(),
  RUNNING_NODE: z.string().optional(),
  NODE_RESULTS: z
    .object({
      cmd: z.string(),
      id: z.string(),
      result: z.custom<BlockResult>(),
    })
    .optional(),
});

export type WorkerJobResponse = z.infer<typeof WorkerJobResponse>;
