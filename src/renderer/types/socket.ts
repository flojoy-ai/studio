import { z } from "zod";
import { BlockResult } from "./block-result";

export enum ServerStatus {
  OFFLINE = "🛑 server offline",
  CONNECTING = "Connecting to server...",
  RUN_IN_PROCESS = "🏃‍♀️ running script...",
  RUN_COMPLETE = "🤙 python script run successful",
  MISSING_RESULTS = "👽 no result found",
  JOB_IN_QUEUE = "🎠 queuing python job= ",
  RESULTS_RETURNED = "🔔 new results - check LOGS",
  STANDBY = "🐢 awaiting a new job",
  SERVER_ONLINE = "🏁 node server online",
  NO_RUNS_YET = "⛷️ No runs yet",
}

export const ServerStatusEnum = z.nativeEnum(ServerStatus);
export type ServerStatusEnum = z.infer<typeof ServerStatusEnum>;

export const WorkerJobResponse = z.object({
  jobsetId: z.string().optional(),
  socketId: z.string().optional(),
  SYSTEM_STATUS: z.string().optional(),
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
