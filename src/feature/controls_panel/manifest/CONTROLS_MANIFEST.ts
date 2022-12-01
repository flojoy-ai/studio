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
}

export enum PlotTypeNames {
  ScatterPlot3D = "3D Scatter Plot",
  ScatterPlot = "Scatter Plot",
  Histogram = "Histogram",
  SurfacePlot3D = "3D Surface Plot",
  Line = "Line",
  BarChart = "Bar Chart",
}

export const OutputControlsManifest = [
  // Inputs
  {
    name: ControlNames.Plot,
    type: ControlTypes.Output,
    minHeight: 3,
    minWidth: 2,
  },
];

export const PlotTypesManifest = [
  // Plot types
  {
    name: PlotTypeNames.ScatterPlot3D,
    type: "scatter3d",
  },
  {
    name: PlotTypeNames.ScatterPlot,
    type: "scatter",
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
    type: "lines",
  },
  {
    name: PlotTypeNames.BarChart,
    type: "bars",
  },
];

export const InputControlsManifest = [
  // Outputs
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
];
