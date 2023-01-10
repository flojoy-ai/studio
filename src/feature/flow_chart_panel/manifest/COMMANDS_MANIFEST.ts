import manifests from "../../../data/manifests-latest.json";

type Commands = {
  name: string;
  type: string;
  key: string;
  inputs?: { name: string; id: string; type: string }[];
}[];

export const COMMANDS: Commands = manifests.commands;

export const SECTIONS = [
  {
    title: "Generators",
    child: [
      // Generators tab
      { name: "Simulations", key: "SIMULATION" },
      { name: "Sample Datasets", key: "SAMPLE_DATASET" },
      { name: "Sample Images", key: "SAMPLE_IMAGE" },
      { name: "Generators", key: "GENERATOR" },
    ],
  },
  {
    title: "Conditionals, Timers, & Loops",
    child: [
      // Conditionals, Timers, & Loops
      { name: "Timers", key: "TIMER" },
      { name: "Loops", key: "LOOP" },
      { name: "Conditionals", key: "CONDITIONAL" }
    ],
  },
  {
    title: "Transformers",
    child: [
      // Transformers tab
      {name: 'Arithmetic', key: 'ARITHMETIC'},
      { name: "Array & matrix manipulation", key: "ARRAY_AND_MATRIX" },
      { name: "Signal processing", key: "SIGNAL_PROCESSING" },
      { name: "Regressions", key: "REGRESSIONS" },
      { name: "Image processing", key: "IMAGE_PROCESSING" },
      { name: "Image identification", key: "IMAGE_IDENTIFICATION" },
    ],
  },

  {
    title: "Loaders",
    child: [
      // Loaders tab
      { name: "Cloud Databases", key: "CLOUD_DATABASE" },
      { name: "Cloud File Systems", key: "CLOUD_FILE_SYSTEM" },
      { name: "Local File System", key: "LOCAL_FILE_SYSTEM" },
    ],
  },

  {
    title: "Extractors",
    child: [
      // Extractors tab
      { name: "Files", key: "FILE" },
      { name: "DAQ", key: "DAQ" },
    ],
  },

  {
    title: "Visualizations",
    child: [
      // Visualization tab
      { name: "Visualization", key: "VISOR" },
    ],
  },
];
