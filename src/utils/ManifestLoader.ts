import manifests from "@src/data/manifests-latest.json";
import { fromZodError } from "zod-validation-error";
import { z, ZodError } from "zod";

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

const manifestSchema = z.object({
  commands: commandsSchema,
  parameters: paramsSchema,
});

export type Manifest = z.infer<typeof manifestSchema>;
export type ManifestParams = z.infer<typeof paramsSchema>;
export type ManifestCommands = z.infer<typeof commandsSchema>;

export function getManifestParams() {
  try {
    const parsedManifest: Manifest = manifestSchema.parse(manifests);
    return parsedManifest.parameters;
  } catch (e) {
    if (e instanceof ZodError) {
      throw fromZodError(e);
    } else {
      throw e;
    }
  }
}

export function getManifestCmds() {
  try {
    const parsedManifest: Manifest = manifestSchema.parse(manifests);
    return parsedManifest.commands;
  } catch (e) {
    if (e instanceof ZodError) {
      throw fromZodError(e);
    } else {
      throw new Error("something is seriously wrong");
    }
  }
}

export type CommandManifestMap = {
  [key: string]: ManifestCommands;
};

export function getManifestCmdsMap(): CommandManifestMap {
  return getManifestCmds().reduce((result, element) => {
    if (element.type in result) {
      result[element.type] = [...result[element.type], element];
    } else {
      result[element.type] = [element];
    }
    return result;
  }, {});
}

const baseCategorySchema = z.object({
  title: z.string(),
  // this optional down below is kinda like a hack for recursive type
  key: z.string().optional(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

export type CommandSection = z.infer<typeof categorySchema>;

// export function getCommandSectionMap() {}

// TODO: should probably move this to a json file
const CMND_TREE: CommandSection = categorySchema.parse({
  title: "ROOT",
  subcategories: [
    {
      title: "AI and Machine learning",
      subcategories: [
        {
          title: "Object detection",
          key: "OBJECT_DETECTION",
        },
        { title: "Regression", key: "REGRESSION" },
        {
          title: "Classification",
          key: "CLASSIFICATION",
        },
        {
          title: "Predict Time Series",
          key: "PREDICT_TIME_SERIES",
        },
      ],
    },
    {
      title: "SCIentific PYthon (SciPy)",
      subcategories: [
        { title: "Stats", key: "SCIPY_STATS" },
        { title: "Signal", key: "SCIPY_SIGNAL" },
      ],
    },
    {
      title: "NUMeric PYthon (NumPy)",
      subcategories: [{ title: "Linalg", key: "NUMPY_LINALG" }],
    },
    {
      title: "Extractors",
      subcategories: [
        // Extractors tab
        { title: "Dataframes", key: "DATAFRAME" },
        { title: "Files", key: "FILE" },
        { title: "DAQ", key: "DAQ" },
      ],
    },
    {
      title: "Generators",
      subcategories: [
        // Generators tab
        { title: "Simulations", key: "SIMULATION" },
        { title: "Sample datasets", key: "SAMPLE_DATASET" },
        { title: "Sample images", key: "SAMPLE_IMAGE" },
      ],
    },
    {
      title: "Instruments",
      subcategories: [
        { title: "Web cam", key: "WEB_CAM" },
        { title: "Keithley", key: "KEITHLEY" },
        { title: "Labjack", key: "LABJACK" },
        { title: "Phidget", key: "PHIDGET" },
        { title: "Serial", key: "SERIAL" },
        { title: "Stepper driver Tic", key: "STEPPER" },
        { title: "Stepper driver Tic knob", key: "STEPPER2" },
      ],
    },
    {
      title: "Loaders",
      subcategories: [
        // Loaders tab
        { title: "Cloud databases", key: "CLOUD_DATABASE" },
        {
          title: "Cloud file systems",
          key: "CLOUD_FILE_SYSTEM",
        },
        {
          title: "Local file system",
          key: "LOCAL_FILE_SYSTEM",
        },
      ],
    },
    {
      title: "Logic gates",
      subcategories: [
        // Conditionals, Timers, & Loops
        { title: "Timers", key: "TIMER" },
        { title: "Loops", key: "LOOP" },
        { title: "Conditionals", key: "CONDITIONAL" },
        { title: "Terminators", key: "TERMINATOR" },
      ],
    },
    {
      title: "Transformers",
      subcategories: [
        // Transformers tab
        { title: "Arithmetic", key: "ARITHMETIC" },
        {
          title: "Signal processing",
          key: "SIGNAL_PROCESSING",
        },
        { title: "Regressions", key: "REGRESSIONS" },
        { title: "Image processing", key: "IMAGE_PROCESSING" },
        {
          title: "Image identification",
          key: "IMAGE_IDENTIFICATION",
        },
        {
          title: "Matrix manipulation",
          key: "MATRIX_MANIPULATION",
        },
        { title: "Array selection", key: "SELECT_ARRAY" },
        { title: "Type casting", key: "TYPE_CASTING" },
      ],
    },
    {
      title: "Visualizers",
      subcategories: [
        // Visualization tab
        { title: "Plotly", key: "PLOTLY_VISOR" },
        { title: "Data Structure", key: "DATA_STRUCTURE" },
      ],
    },
  ],
});

export { CMND_TREE };
