import { NodeProps } from "reactflow";
import { z } from "zod";

export type PythonType = "int" | "float" | "bool" | "select";

export const SliderConfig = z.object({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number(),
});
export type SliderConfig = z.infer<typeof SliderConfig>;

export const CONFIGURABLE = ["slider"] as const;
export type Configurable = (typeof CONFIGURABLE)[number];

export const isConfigurable = (
  widgetType: WidgetType,
): widgetType is Configurable => {
  return CONFIGURABLE.includes(widgetType);
};

export type Config = {
  slider: SliderConfig;
};

export const CONFIG_DEFAULT_VALUES = {
  slider: {
    type: "slider",
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Record<Configurable, WidgetConfig>;

export type WidgetConfig = Config[keyof Config];

export const WIDGET_TYPES = [
  "slider",
  "number input",
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
