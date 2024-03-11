import { NodeProps } from "reactflow";
import { z } from "zod";

export type PythonType = "int" | "float" | "bool" | "select" | "File";

export const SliderConfig = z.object({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number(),
});
export type SliderConfig = z.infer<typeof SliderConfig>;

const isValidFileFilter = (filter: string) => {
  if (filter === "") return true;
  // Regular expression pattern to match file extensions
  const extensionPattern = /^\.[a-zA-Z0-9]+$/;

  // Regular expression pattern to match pattern notation like image/*
  const patternPattern = /^[a-zA-Z0-9]+\/.*$/;

  return extensionPattern.test(filter) || patternPattern.test(filter);
};

export const FileUploadConfig = z.object({
  type: z.literal("file upload"),
  allowedExtensions: z.array(
    z.object({
      ext: z
        .string()
        .transform((s) => s.trim())
        .refine(isValidFileFilter, {
          message:
            'Invalid file filter. Must be in the form ".ext" or "type/*"',
        }),
    }),
  ),
});
export type FileUploadConfig = z.infer<typeof FileUploadConfig>;

export const CONFIGURABLE = ["slider", "file upload"] as const;
export type Configurable = (typeof CONFIGURABLE)[number];

export const isConfigurable = (
  widgetType: WidgetType,
): widgetType is Configurable => {
  return CONFIGURABLE.includes(widgetType);
};

export type Config = {
  slider: SliderConfig;
  "file upload": FileUploadConfig;
};

export const CONFIG_DEFAULT_VALUES = {
  slider: {
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
  },
  "file upload": {
    type: "file upload",
    allowedExtensions: [{ ext: "" }],
  },
} satisfies Record<Configurable, WidgetConfig>;

export type WidgetConfig = Config[keyof Config];

export const WIDGET_TYPES = [
  "slider",
  "number input",
  "file upload",
  "checkbox",
  "switch",
  "combobox",
] as const;
export const isWidgetType = (value: string): value is WidgetType =>
  WIDGET_TYPES.includes(value);

export const WidgetType = z.enum(WIDGET_TYPES);
export type WidgetType = z.infer<typeof WidgetType>;

export const WidgetBlockInfo = z.object({
  blockId: z.string(),
  blockParameter: z.string(),
  widgetType: WidgetType,
});
export type WidgetBlockInfo = z.infer<typeof WidgetBlockInfo>;

export type WidgetData<
  T extends WidgetConfig | undefined = WidgetConfig | undefined,
> = {
  blockId: string;
  blockParameter: string;
  label?: string;
  config: T;
};

export type VisualizationType =
  | "scatter"
  | "histogram"
  | "line"
  | "surface3d"
  | "scatter3d"
  | "bar"
  | "table"
  | "image"
  | "box"
  | "big_number"
  | "matrix_view"
  | "array_view";

export type VisualizationData = {
  blockId: string;
  visualizationType: string;
};

export type WidgetProps<T extends WidgetConfig | undefined = undefined> =
  NodeProps<WidgetData<T>>;
