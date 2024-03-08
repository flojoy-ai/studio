import { NodeProps } from "reactflow";
import { z } from "zod";

export type PythonType = "int" | "float" | "bool";

export const SliderConfig = z.object({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number(),
});
export type SliderConfig = z.infer<typeof SliderConfig>;

export const NumberInputConfig = z.object({
  type: z.literal("numberInput"),
  min: z.number(),
  max: z.number(),
});
export type NumberInputConfig = z.infer<typeof NumberInputConfig>;

export const CONFIGURABLE = ["slider", "numberInput"] as const;
export type Configurable = (typeof CONFIGURABLE)[number];

export type Config = {
  slider: SliderConfig;
  numberInput: NumberInputConfig;
};

export type WidgetConfig = Config[keyof Config];

export const WIDGET_TYPES = ["slider", "numberInput", "checkbox"] as const;
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
