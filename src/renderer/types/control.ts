import { NodeProps } from "reactflow";
import { z } from "zod";
import { SliderNode } from "@/renderer/components/controls/slider-node";
import { NumberInputNode } from "@/renderer/components/controls/number-input-node";
import { FileUploadNode } from "@/renderer/components/controls/file-upload-node";
import { CheckboxNode } from "@/renderer/components/controls/checkbox-node";
import { SwitchNode } from "@/renderer/components/controls/switch-node";
import { ComboboxNode } from "@/renderer/components/controls/combobox-node";
import { RadioGroupNode } from "@/renderer/components/controls/radio-group-node";
import { ValuesOf, typedObjectKeys } from "./util";

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

export const WIDGET_NODES = {
  slider: SliderNode,
  "number input": NumberInputNode,
  "file upload": FileUploadNode,
  checkbox: CheckboxNode,
  switch: SwitchNode,
  combobox: ComboboxNode,
  "radio group": RadioGroupNode,
} as const;

export const WIDGET_CONFIGS = {
  slider: {
    schema: SliderConfig,
    defaultValues: {
      type: "slider",
      min: 0,
      max: 100,
      step: 1,
    },
  },
  "file upload": {
    schema: FileUploadConfig,
    defaultValues: {
      type: "file upload",
      allowedExtensions: [{ ext: "" }],
    },
  },
} as const;

const [k, ks] = typedObjectKeys(WIDGET_NODES);
export const WidgetType = z.enum([k, ...ks]);
export type WidgetType = z.infer<typeof WidgetType>;

export const isWidgetType = (value: string): value is WidgetType =>
  value in WIDGET_NODES;

export type Configurable = keyof typeof WIDGET_CONFIGS;

export const isConfigurable = (
  widgetType: WidgetType,
): widgetType is Configurable => {
  return widgetType in WIDGET_CONFIGS;
};

type GetConfigSchemas<T> = {
  [K in keyof T]: T[K] extends { schema: infer S }
    ? S extends z.ZodType
      ? z.infer<S>
      : never
    : never;
};
export type ConfigMap = GetConfigSchemas<typeof WIDGET_CONFIGS>;
export type WidgetConfig = ValuesOf<ConfigMap>;

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

export type WidgetProps<
  T extends WidgetConfig | undefined = WidgetConfig | undefined,
> = NodeProps<WidgetData<T>>;
