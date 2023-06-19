import { fromZodError } from "zod-validation-error";
import { z, ZodError } from "zod";
import CommandManifest from "../../generate_manifest.json";

const commandsSchema = z.array(
  z.object({
    name: z.string(),
    key: z.string(),
    type: z.string(),
    inputs: z.optional(
      z.array(z.object({ name: z.string(), id: z.string(), type: z.string() }))
    ),
    ui_component_id: z.optional(z.string()),
    pip_dependencies: z.optional(
      z.array(z.object({ name: z.string(), v: z.optional(z.string()) }))
    ),
  })
);

const paramsSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.object({
      type: z.string(),
      default: z.union([z.string(), z.number(), z.boolean()]).nullish(),
      options: z.optional(z.array(z.string())),
    })
  )
);

export type NodeElement = {
  name: string;
  key: string;
  type: string;
  inputs?: { name: string; id: string; type: string }[];
  parameters?: Record<
    string,
    {
      type: string;
      default?: string | number | boolean | null;
      options?: string[];
    }
  >;
  pip_dependencies?: { name: string; v?: string }[];
  ui_component_id?: string;
  children: null;
};

export type Manifest_Child<T> = {
  name: string;
  key?: string;
  type?: string;
  children: Manifest_Child<T>[] | T[];
};
export type CMND_MANIFEST<T> = {
  name: string;
  key?: string;
  children: Manifest_Child<T>[];
};

const manifestSchema = z.object({
  // commands: commandsSchema,
  parameters: paramsSchema,
});

export type Manifest = z.infer<typeof manifestSchema>;
export type ManifestParams = z.infer<typeof paramsSchema>;
export type ManifestCommands = z.infer<typeof commandsSchema>;

export function getManifestParams() {
  return {};
  // try {
  //   const parsedManifest: Manifest = manifestSchema.parse(manifests);
  //   return parsedManifest.parameters;
  // } catch (e) {
  //   if (e instanceof ZodError) {
  //     throw fromZodError(e);
  //   } else {
  //     throw e;
  //   }
  // }
}

export function getManifestCmds() {
  return {};
  // try {
  //   const parsedManifest: Manifest = manifestSchema.parse(manifests);
  //   return parsedManifest.commands;
  // } catch (e) {
  //   if (e instanceof ZodError) {
  //     throw fromZodError(e);
  //   } else {
  //     throw new Error("something is seriously wrong");
  //   }
  // }
}

export type CommandManifestMap = {
  [key: string]: ManifestCommands;
};

export function getManifestCmdsMap(): CommandManifestMap {
  return {};
}

// TODO: should probably move this to a json file
const CMND_TREE: CMND_MANIFEST<NodeElement> = CommandManifest as CMND_MANIFEST<NodeElement>;



export { CMND_TREE };
