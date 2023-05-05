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
}

//ROOT WILL NOT BE DISPLAYED
export const CTRL_TREE = {
  title: "ROOT",
  child: [
    {
      title: "Inputs",
      child: [
        {
          title: "Continuous Variables",
          child: [
            {
              title: "Slider",
              key: "SLIDER",
              child: null,
            },
            {
              title: "Knob",
              key: "KNOB",
              child: null,
            },
            {
              title: "Numeric Text Input",
              key: "NUMERIC_INPUT",
              child: null,
            },
          ],
        },
        {
          title: "Discrete Variables",
          child: [
            {
              title: "Radio Button Group",
              key: "RADIO_BUTTON_GROUP",
              child: null,
            },
            {
              title: "Checkbox Button Group",
              key: "CHECKBOX_BUTTON_GROUP",
              child: null,
            },
            {
              title: "Constants",
              key: "STATIC_NUMERIC_INPUT",
              child: null,
            },
          ],
        },
        {
          title: "Booleans & Nodes",
          child: [
            {
              title: "Toggle switch",
              key: "TOGGLE_SWITCH",
              child: null,
            },
            {
              title: "Node Reference",
              key: "NODE_REFERENCE",
              child: null,
            },
          ],
        },
        {
          title: "Text & Files",
          child: [
            {
              title: "File Uploader",
              key: "LOCAL_FILE_LOADER",
              child: null,
            },
            {
              title: "Text Input",
              key: "TEXT_INPUT",
              child: null,
            },
          ],
        },
      ],
    },
    {
      title: "Outputs",
      child: [
        {
          title: "LED Display",
          key: "SEVEN_SEGMENT_DISPLAY",
          child: null,
        },
        {
          title: "Media Viewer",
          key: "MEDIA_VIEWER",
          child: null,
        },
        {
          title: "Plotly",
          key: "PLOT",
          child: null,
        }
      ]
    }
  ],
};

export const OutputControlsManifest = [
  {
    name: ControlNames.Plot,
    type: ControlTypes.Output,
    minHeight: 3,
    minWidth: 2,
  },
  {
    name: ControlNames.SevenSegmentDisplay,
    type: ControlTypes.Output,
    minHeight: 3,
    minWidth: 2,
  },
  {
    name: ControlNames.MediaViewer,
    type: ControlTypes.Output,
    minHeight: 3,
    minWidth: 2,
  },
];

export const PlotTypesManifest = {
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
};

export const InputControlsManifest = {
  TEXT_INPUT: {
    name: ControlNames.TextInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 1,
  },
  NUMERIC_INPUT: {
    name: ControlNames.NumericInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 1,
  },
  SLIDER: {
    name: ControlNames.Slider,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  KNOB: {
    name: ControlNames.Knob,
    type: ControlTypes.Input,
    minHeight: 2,
    minWidth: 1,
  },
  STATIC_NUMERIC_INPUT: {
    name: ControlNames.StaticNumericInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  DROPDOWN: {
    name: ControlNames.Dropdown,
    type: ControlTypes.Input,
    minHeight: 2,
    minWidth: 2,
  },
  RADIO_BUTTON_GROUP: {
    name: ControlNames.RadioButtonGroup,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  CHECKBOX_BUTTON_GROUP: {
    name: ControlNames.CheckboxButtonGroup,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  LOCAL_FILE_LOADER: {
    name: ControlNames.LocalFileLoader,
    type: ControlTypes.Input,
    minHeight: 3,
    minWidth: 2,
  },
  NODE_REFERENCE: {
    name: ControlNames.NodeReference,
    type: ControlTypes.Input,
    minHeight: 2,
    minWidth: 2,
  },
};

export const CTRL_MANIFEST = {
  ...InputControlsManifest,
  ...OutputControlsManifest,
  ...PlotTypesManifest,
};
