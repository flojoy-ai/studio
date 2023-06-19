import { CMND_MANIFEST } from "@src/utils/ManifestLoader";
import { PlotData } from "plotly.js";

export enum ControlTypes {
  Input = "input",
  Output = "output",
}

export enum ControlNames {
  NumericInput = "Numeric Input",
  Slider = "Slider",
  Knob = "Knob",
  StaticNumericInput = "Static Numeric Input",
  ArrayNumericInput = "Array Numeric Input",
  Dropdown = "Dropdown",
  RadioButtonGroup = "Radio Button Group",
  CheckboxButtonGroup = "Checkbox Button Group",
  Plot = "Plot",
  TextInput = "Text Input",
  SevenSegmentDisplay = "Seven Segment Display",
  LocalFileLoader = "Local File Loader",
  MediaViewer = "Media Viewer",
  NodeReference = "Node Reference",
}

export enum PlotTypeNames {
  ScatterPlot3D = "3D Scatter Plot",
  ScatterPlot = "Scatter Plot",
  Histogram = "Histogram",
  SurfacePlot3D = "3D Surface Plot",
  Line = "Line",
  BarChart = "Bar Chart",
  Image = "Image",
  Table = "Table",
}

export type ControlElement = {
  name: string;
  key: string;
  type: string;
  minHeight: number;
  minWidth: number;
  children: null;
};

//ROOT WILL NOT BE DISPLAYED
export const CTRL_TREE: CMND_MANIFEST<ControlElement> = {
  name: "ROOT",
  children: [
    {
      name: "Inputs",
      children: [
        {
          name: "Continuous Variables",
          children: [
            {
              name: ControlNames.Slider,
              type: ControlTypes.Input,
              key: "SLIDER",
              minHeight: 1,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.Knob,
              type: ControlTypes.Input,
              key: "KNOB",
              minHeight: 2,
              minWidth: 1,
              children: null,
            },
            {
              name: ControlNames.NumericInput,
              type: ControlTypes.Input,
              key: "NUMERIC_INPUT",
              minHeight: 1,
              minWidth: 1,
              children: null,
            },
            {
              name: ControlNames.ArrayNumericInput,
              type: ControlTypes.Input,
              key: "ARRAY_INPUT",
              minHeight: 1,
              minWidth: 1,
              children: null,
            },
          ],
        },
        {
          name: "Discrete Variables",
          children: [
            {
              name: ControlNames.RadioButtonGroup,
              type: ControlTypes.Input,
              key: "RADIO_BUTTON_GROUP",
              minHeight: 1,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.CheckboxButtonGroup,
              type: ControlTypes.Input,
              key: "CHECKBOX_BUTTON_GROUP",
              minHeight: 1,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.StaticNumericInput,
              type: ControlTypes.Input,
              key: "STATIC_NUMERIC_INPUT",
              minHeight: 1,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.Dropdown,
              type: ControlTypes.Input,
              key: "DROPDOWN",
              minHeight: 2,
              minWidth: 2,
              children: null,
            },
          ],
        },
        {
          name: "Booleans & Nodes",
          children: [
            {
              name: "Toggle switch",
              key: "TOGGLE_SWITCH",
              type: ControlTypes.Input,
              minHeight: 2,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.NodeReference,
              type: ControlTypes.Input,
              key: "NODE_REFERENCE",
              minHeight: 2,
              minWidth: 2,
              children: null,
            },
          ],
        },
        {
          name: "Text & Files",
          children: [
            {
              name: ControlNames.LocalFileLoader,
              type: ControlTypes.Input,
              key: "LOCAL_FILE_LOADER",
              minHeight: 3,
              minWidth: 2,
              children: null,
            },
            {
              name: ControlNames.TextInput,
              type: ControlTypes.Input,
              key: "TEXT_INPUT",
              minHeight: 1,
              minWidth: 1,

              children: null,
            },
          ],
        },
      ],
    },
    {
      name: "Outputs",
      children: [
        {
          name: "PLOTLY",
          children: [
            {
              name: ControlNames.Plot,
              type: ControlTypes.Output,
              key: "PLOT",
              minHeight: 3,
              minWidth: 2,
              children: null,
            },
          ],
        },
        {
          name: "MEDIA VIEWER",
          children: [
            {
              name: ControlNames.MediaViewer,
              type: ControlTypes.Output,
              key: "MEDIA_VIEWER",
              minHeight: 3,
              minWidth: 2,
              children: null,
            },
          ],
        },
        {
          name: "LED DISPLAY",
          children: [
            {
              name: ControlNames.SevenSegmentDisplay,
              type: ControlTypes.Output,
              key: "SEVEN_SEGMENT_DISPLAY",
              minHeight: 3,
              minWidth: 2,
              children: null,
            },
          ],
        },
      ],
    },
  ],
};

type PlotManifestType = {
  name: string;
  type?: PlotData["type"];
  mode?: PlotData["mode"];
};

export const PlotTypesManifest: { [key: string]: PlotManifestType } = {
  // Plot types
  SCATTER_PLOT_3D: {
    name: PlotTypeNames.ScatterPlot3D,
    type: "scatter3d",
    mode: "markers",
  },
  SCATTER_PLOT: {
    name: PlotTypeNames.ScatterPlot,
    type: "scatter",
    mode: "markers",
  },
  HISTOGRAM: {
    name: PlotTypeNames.Histogram,
    type: "histogram",
    mode: "lines",
  },
  SURFACE_PLOT_3D: {
    name: PlotTypeNames.SurfacePlot3D,
    type: "surface",
  },
  LINE: {
    name: PlotTypeNames.Line,
    type: "scatter",
    mode: "lines",
  },
  BAR_CHART: {
    name: PlotTypeNames.BarChart,
    type: "bar",
  },
  IMAGE: {
    name: PlotTypeNames.Image,
    type: "image",
  },
  TABLE: {
    name: PlotTypeNames.Table,
    type: "table",
  },
};
