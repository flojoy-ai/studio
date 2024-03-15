import { NodeProps } from "reactflow";
import { z } from "zod";
import { SliderNode } from "@/renderer/components/controls/widgets/slider-node";
import { NumberInputNode } from "@/renderer/components/controls/widgets/number-input-node";
import { FileUploadNode } from "@/renderer/components/controls/widgets/file-upload-node";
import { CheckboxNode } from "@/renderer/components/controls/widgets/checkbox-node";
import { SwitchNode } from "@/renderer/components/controls/widgets/switch-node";
import { ComboboxNode } from "@/renderer/components/controls/widgets/combobox-node";
import { RadioGroupNode } from "@/renderer/components/controls/widgets/radio-group-node";
import { ValuesOf, getZodEnumFromObjectKeys } from "./util";
import { KnobNode } from "@/renderer/components/controls/widgets/knob-node";
import {
  LucideIcon,
  SlidersHorizontal,
  TextCursorInput,
  File,
  SquareCheck,
  ToggleRight,
  ChevronsUpDown,
  CircleDot,
  Radius,
  Square,
  ScatterChart,
} from "lucide-react";
import { SevenSegmentDisplayNode } from "@/renderer/components/controls/visualization/seven-segment-display-node";
import VisualizationNode from "@/renderer/components/controls/visualization-node";

export const PYTHON_TYPES = ["int", "float", "bool", "select", "File"] as const;
export const PythonType = z.enum(PYTHON_TYPES);
export type PythonType = z.infer<typeof PythonType>;

export const SliderConfig = z.object({
  type: z.literal("slider"),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  floating: z.boolean().optional(),
});
export type SliderConfig = z.infer<typeof SliderConfig>;

export const KnobConfig = z.object({
  type: z.literal("knob"),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  floating: z.boolean().optional(),
});
export type KnobConfig = z.infer<typeof KnobConfig>;

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

type WidgetEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: React.FC<WidgetProps<any>>;
  allowedTypes: PythonType[];
  icon: LucideIcon;
};

export const WIDGETS = {
  slider: {
    node: SliderNode,
    allowedTypes: ["int", "float"],
    icon: SlidersHorizontal,
  },
  "number input": {
    node: NumberInputNode,
    allowedTypes: ["int", "float"],
    icon: TextCursorInput,
  },
  "file upload": { node: FileUploadNode, allowedTypes: ["File"], icon: File },
  checkbox: { node: CheckboxNode, allowedTypes: ["bool"], icon: SquareCheck },
  switch: { node: SwitchNode, allowedTypes: ["bool"], icon: ToggleRight },
  combobox: {
    node: ComboboxNode,
    allowedTypes: ["select"],
    icon: ChevronsUpDown,
  },
  "radio group": {
    node: RadioGroupNode,
    allowedTypes: ["select"],
    icon: CircleDot,
  },
  knob: { node: KnobNode, allowedTypes: ["int", "float"], icon: Radius },
} as const satisfies Record<string, WidgetEntry>;

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
  knob: {
    schema: KnobConfig,
    defaultValues: {
      type: "knob",
      min: 0,
      max: 100,
      step: 1,
    },
  },
} as const;

const WidgetType = getZodEnumFromObjectKeys(WIDGETS);
export type WidgetType = z.infer<typeof WidgetType>;

export const isWidgetType = (value: string): value is WidgetType =>
  value in WIDGETS;

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

export type WidgetProps<
  T extends WidgetConfig | undefined = WidgetConfig | undefined,
> = NodeProps<WidgetData<T>>;

export const FLOJOY_TYPES = ["Scalar", "Plotly"] as const;
export const FlojoyType = z.enum(FLOJOY_TYPES);
export type FlojoyType = z.infer<typeof FlojoyType>;

type VisualizationEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: React.FC<VisualizationProps>;
  allowedTypes: FlojoyType[];
  icon: LucideIcon;
};

export const VISUALIZATIONS = {
  "seven segment display": {
    node: SevenSegmentDisplayNode,
    allowedTypes: ["Scalar"],
    icon: Square,
  },
  mirror: {
    node: VisualizationNode,
    allowedTypes: ["Plotly"],
    icon: ScatterChart,
  },
} as const satisfies Record<string, VisualizationEntry>;

export const VisualizationType = getZodEnumFromObjectKeys(VISUALIZATIONS);
export type VisualizationType = z.infer<typeof VisualizationType>;

export type VisualizationData = {
  blockId: string;
  blockOutput: string;
  label?: string;
  visualizationType: VisualizationType;
};

export type VisualizationProps = NodeProps<VisualizationData>;
