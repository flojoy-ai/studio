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
  MediaViewer = "Media Viewer"
}

export enum PlotTypeNames {
  ScatterPlot3D = "3D Scatter Plot",
  ScatterPlot = "Scatter Plot",
  Histogram = "Histogram",
  SurfacePlot3D = "3D Surface Plot",
  Line = "Line",
  BarChart = "Bar Chart",
  Image = "Image"
}

export const OutputControlsManifest = [
  // Inputs
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
type IPlotTypesManifest ={
  name: PlotTypeNames,
  type: PlotData['type'],
  mode?: PlotData['mode']
}
export const PlotTypesManifest: IPlotTypesManifest[] = [
  // Plot types
  {
    name: PlotTypeNames.ScatterPlot3D,
    type: "scatter3d",
    mode: "markers"
  },
  {
    name: PlotTypeNames.ScatterPlot,
    type: "scatter",
    mode: "markers"
  },
  {
    name: PlotTypeNames.Histogram,
    type: "histogram",
  },
  {
    name: PlotTypeNames.SurfacePlot3D,
    type: "surface",
  },
  {
    name: PlotTypeNames.Line,
    type: "scatter",
    mode: "lines"
  },
  {
    name: PlotTypeNames.BarChart,
    type: "bar",
  },
  {
    name: PlotTypeNames.Image,
    type: "image",
  },
];

export const InputControlsManifest = [
  // Outputs
  {
    name: ControlNames.TextInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 1,
  },
  {
    name: ControlNames.NumericInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 1,
  },
  {
    name: ControlNames.Slider,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  {
    name: ControlNames.Knob,
    type: ControlTypes.Input,
    minHeight: 2,
    minWidth: 1,
  },
  {
    name: ControlNames.StaticNumericInput,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  {
    name: ControlNames.Dropdown,
    type: ControlTypes.Input,
    minHeight: 2,
    minWidth: 2,
  },
  {
    name: ControlNames.RadioButtonGroup,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  {
    name: ControlNames.CheckboxButtonGroup,
    type: ControlTypes.Input,
    minHeight: 1,
    minWidth: 2,
  },
  {
    name: ControlNames.LocalFileLoader,
    type: ControlTypes.Input,
    minHeight: 3,
    minWidth: 2,
  },
];
