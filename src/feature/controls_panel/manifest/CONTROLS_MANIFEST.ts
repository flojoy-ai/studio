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
];
