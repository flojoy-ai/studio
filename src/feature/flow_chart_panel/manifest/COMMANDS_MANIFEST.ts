import manifests from "../../../data/manifests-latest.json";

type Commands = Record<
  string,
  {
    title: string;
    type: string;
    key: string;
    inputs?: { name: string; id: string; type: string }[];
    ui_component_id?: string;
    pip_dependencies?: Array<{
      name: string;
      v?: string | number;
    }>;
  }
>;

const CMND_MANIFEST: Commands = manifests.commands.reduce((result, element) => {
  result[element.type] = element;
  result["title"] = result["name"];
  return result;
}, {});

const CMND_TREE = {
  title: "ROOT",
  child: [
    {
      title: "AI and Machine learning",
      child: [
        {
          title: "Object detection",
          key: "AI_OBJECT_DETECTION",
          child: null,
        },
      ],
    },

    {
      title: "Extractors",
      child: [
        // Extractors tab
        { title: "Files", key: "FILE", child: null },
        { title: "DAQ", key: "DAQ", child: null },
      ],
    },
    {
      title: "Generators",
      child: [
        // Generators tab
        { title: "Simulations", key: "SIMULATION", child: null },
        { title: "Sample datasets", key: "SAMPLE_DATASET", child: null },
        { title: "Sample images", key: "SAMPLE_IMAGE", child: null },
      ],
    },
    {
      title: "Instruments",
      child: [
        { title: "Web cam", key: "WEB_CAM", child: null },
        { title: "Keithley", key: "KEITHLEY", child: null },
        { title: "Labjack", key: "LABJACK", child: null },
        { title: "Phidget", key: "PHIDGET", child: null },
        { title: "Serial", key: "SERIAL", child: null },
        { title: "Stepper driver Tic", key: "STEPPER", child: null },
        { title: "Stepper driver Tic knob", key: "STEPPER2", child: null },
      ],
    },
    {
      title: "Loaders",
      child: [
        // Loaders tab
        { title: "Cloud databases", key: "CLOUD_DATABASE", child: null },
        { title: "Cloud file systems", key: "CLOUD_FILE_SYSTEM", child: null },
        { title: "Local file system", key: "LOCAL_FILE_SYSTEM", child: null },
      ],
    },
    {
      title: "Logic gates",
      child: [
        // Conditionals, Timers, & Loops
        { title: "Timers", key: "TIMER", child: null },
        { title: "Loops", key: "LOOP", child: null },
        { title: "Conditionals", key: "CONDITIONAL", child: null },
        { title: "Terminators", key: "TERMINATOR", child: null },
      ],
    },

    {
      title: "Transformers",
      child: [
        // Transformers tab
        { title: "Arithmetic", key: "ARITHMETIC", child: null },
        { title: "Signal processing", key: "SIGNAL_PROCESSING", child: null },
        { title: "Regressions", key: "REGRESSIONS", child: null },
        { title: "Image processing", key: "IMAGE_PROCESSING", child: null },
        {
          title: "Image identification",
          key: "IMAGE_IDENTIFICATION",
          child: null,
        },
        {
          title: "Matrix manipulation",
          key: "MATRIX_MANIPULATION",
          child: null,
        },
        { title: "Array selection", key: "SELECT_ARRAY", child: null },
      ],
    },

    {
      title: "Visualizers",
      child: [
        // Visualization tab
        { title: "Plotly", key: "PLOTLY_VISOR", child: null },
      ],
    },
  ],
};

export { CMND_MANIFEST, CMND_TREE };
