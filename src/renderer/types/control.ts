import { NodeProps } from "reactflow";
import { z } from "zod";

export const SliderConfig = z.object({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number(),
});

export type SliderConfig = z.infer<typeof SliderConfig>;

export type WidgetConfig = SliderConfig;

export const WidgetType = z.enum(["slider"]);
export type WidgetType = z.infer<typeof WidgetType>;

export const WidgetBlockInfo = z.object({
  blockId: z.string(),
  blockParameter: z.string(),
  widgetType: WidgetType,
});
export type WidgetBlockInfo = z.infer<typeof WidgetBlockInfo>;

export type WidgetData<T extends WidgetConfig = WidgetConfig> = {
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

export type WidgetProps<T extends WidgetConfig> = NodeProps<WidgetData<T>>;
