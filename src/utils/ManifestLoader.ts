import manifests from "@src/data/manifests-latest.json";

import { z } from "zod";

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

type FuncParamsType = z.infer<typeof paramsSchema>;

const FUNCTION_PARAMETERS: FuncParamsType = paramsSchema.parse(
  manifests.parameters
);
type NodeElement = {
  name: string;
  type: string;
  key: string;
  inputs?: { name: string; id: string; type: string }[];
  ui_component_id?: string;
  pip_dependencies?: Array<{
    name: string;
    v?: string | number;
  }>;
}[];

export type CommandManifestMap = {
  [key: string]: NodeElement;
};

export type CommandSection = {
  title: string;
  children: CommandSection[] | null;
  key?: string;
};

const CMND_MANIFEST = manifests.commands;

const CMND_MANIFEST_MAP: CommandManifestMap = manifests.commands.reduce(
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
