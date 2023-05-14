import manifests from "../../../data/manifests-latest.json";

type Commands = {
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

type Sections = {
  title: string;
  child: {
    name: string;
    key: string;
    child?: Sections[0]["child"];
  }[];
}[];

export const COMMANDS: Commands = manifests.commands;

export const SECTIONS: Sections = [
  {
    title: "AI and Machine learning",
    child: [
      {
        name: "Object detection",
        key: "AI_OBJECT_DETECTION",
      },
    ],
  },
  {
    title: "SCIentific PYthon (SCIPY)",
    child: [
      {name: "SciPy Signal",key: "SCIPY_SIGNAL"},
      {name: "SciPy Stats", key: "SCIPY_STATS"}
    ],
  },
  {
    title: "NUMeric PYthon (NUMPY)",
    child: [
      {
        name: "NumPy",
        key: "NUMPY",
      },
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
    title: "Generators",
    child: [
      // Generators tab
      { name: "Simulations", key: "SIMULATION" },
      { name: "Sample datasets", key: "SAMPLE_DATASET" },
      { name: "Sample images", key: "SAMPLE_IMAGE" },
    ],
  },
  {
    title: "Instruments",
    child: [
      { name: "Web cam", key: "WEB_CAM" },
      { name: "Keithley", key: "KEITHLEY" },
      { name: "Labjack", key: "LABJACK" },
      { name: "Phidget", key: "PHIDGET" },
      { name: "Serial", key: "SERIAL" },
    ],
  },
  {
    title: "Loaders",
    child: [
      // Loaders tab
      { name: "Cloud databases", key: "CLOUD_DATABASE" },
      { name: "Cloud file systems", key: "CLOUD_FILE_SYSTEM" },
      { name: "Local file system", key: "LOCAL_FILE_SYSTEM" },
    ],
  },
  {
    title: "Logic gates",
    child: [
      // Conditionals, Timers, & Loops
      { name: "Timers", key: "TIMER" },
      { name: "Loops", key: "LOOP" },
      { name: "Conditionals", key: "CONDITIONAL" },
      { name: "Terminators", key: "TERMINATOR" },
    ],
  },

  {
    title: "Transformers",
    child: [
      // Transformers tab
      { name: "Arithmetic", key: "ARITHMETIC" },
      { name: "Signal processing", key: "SIGNAL_PROCESSING" },
      { name: "Regressions", key: "REGRESSIONS" },
      { name: "Image processing", key: "IMAGE_PROCESSING" },
      { name: "Image identification", key: "IMAGE_IDENTIFICATION" },
      { name: "Matrix manipulation", key: "MATRIX_MANIPULATION" },
      { name: "Array selection", key: "SELECT_ARRAY" },
    ],
  },

  {
    title: "Visualizers",
    child: [
      // Visualization tab
      { name: "Plotly", key: "PLOTLY_VISOR" },
    ],
  },
];
