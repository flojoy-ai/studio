import manifests from "@src/data/manifests-latest.json";

import { z } from "zod";

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
      default: z.union([z.string(), z.number(), z.boolean()]),
      options: z.optional(z.array(z.string())),
    })
  )
);

const manifestSchema = z.object({
  commands: commandsSchema,
  parameters: paramsSchema,
});

type Manifest = z.infer<typeof manifestSchema>;
type ManifestParams = z.infer<typeof paramsSchema>;
type ManifestCommands = z.infer<typeof commandsSchema>;

const parsedManifest: Manifest = manifestSchema.parse(manifests);

const FUNCTION_PARAMETERS: ManifestParams = parsedManifest.parameters;
const CMND_MANIFEST: ManifestCommands = parsedManifest.commands;

//type NodeElement = {
//  name: string;
//  type: string;
//  key: string;
//  inputs?: { name: string; id: string; type: string }[];
//  ui_component_id?: string;
//  pip_dependencies?: Array<{
//    name: string;
//    v?: string;
//  }>;
//}[];

export type CommandManifestMap = {
  [key: string]: ManifestCommands;
};

export type CommandSection = {
  title: string;
  children: CommandSection[] | null;
  key?: string;
};

const CMND_MANIFEST_MAP: CommandManifestMap = CMND_MANIFEST.reduce(
  (result, element) => {
    if (element.type in result) {
      result[element.type] = [...result[element.type], element];
    } else {
      result[element.type] = [element];
    }
    return result;
  },
  {}
);

//console.log(CMND_MANIFEST_MAP);

const CMND_TREE: CommandSection = {
  title: "ROOT",
  children: [
    {
      title: "AI and Machine learning",
      children: [
        {
          title: "Object detection",
          key: "AI_OBJECT_DETECTION",
          children: null,
        },
      ],
    },

    {
      title: "Extractors",
      children: [
        // Extractors tab
        { title: "Files", key: "FILE", children: null },
        { title: "DAQ", key: "DAQ", children: null },
      ],
    },
    {
      title: "Generators",
      children: [
        // Generators tab
        { title: "Simulations", key: "SIMULATION", children: null },
        { title: "Sample datasets", key: "SAMPLE_DATASET", children: null },
        { title: "Sample images", key: "SAMPLE_IMAGE", children: null },
      ],
    },
    {
      title: "Instruments",
      children: [
        { title: "Web cam", key: "WEB_CAM", children: null },
        { title: "Keithley", key: "KEITHLEY", children: null },
        { title: "Labjack", key: "LABJACK", children: null },
        { title: "Phidget", key: "PHIDGET", children: null },
        { title: "Serial", key: "SERIAL", children: null },
        { title: "Stepper driver Tic", key: "STEPPER", children: null },
        { title: "Stepper driver Tic knob", key: "STEPPER2", children: null },
      ],
    },
    {
      title: "Loaders",
      children: [
        // Loaders tab
        { title: "Cloud databases", key: "CLOUD_DATABASE", children: null },
        {
          title: "Cloud file systems",
          key: "CLOUD_FILE_SYSTEM",
          children: null,
        },
        {
          title: "Local file system",
          key: "LOCAL_FILE_SYSTEM",
          children: null,
        },
      ],
    },
    {
      title: "Logic gates",
      children: [
        // Conditionals, Timers, & Loops
        { title: "Timers", key: "TIMER", children: null },
        { title: "Loops", key: "LOOP", children: null },
        { title: "Conditionals", key: "CONDITIONAL", children: null },
        { title: "Terminators", key: "TERMINATOR", children: null },
      ],
    },
    {
      title: "Transformers",
      children: [
        // Transformers tab
        { title: "Arithmetic", key: "ARITHMETIC", children: null },
        {
          title: "Signal processing",
          key: "SIGNAL_PROCESSING",
          children: null,
        },
        { title: "Regressions", key: "REGRESSIONS", children: null },
        { title: "Image processing", key: "IMAGE_PROCESSING", children: null },
        {
          title: "Image identification",
          key: "IMAGE_IDENTIFICATION",
          children: null,
        },
        {
          title: "Matrix manipulation",
          key: "MATRIX_MANIPULATION",
          children: null,
        },
        { title: "Array selection", key: "SELECT_ARRAY", children: null },
      ],
    },
    {
      title: "Visualizers",
      children: [
        // Visualization tab
        { title: "Plotly", key: "PLOTLY_VISOR", children: null },
        { title: "Data Structure", key: "DATA_STRUCTURE", children: null },
      ],
    },
  ],
};

export { FUNCTION_PARAMETERS, CMND_MANIFEST, CMND_TREE, CMND_MANIFEST_MAP };
