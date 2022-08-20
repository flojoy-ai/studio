export enum ControlTypes {
    Input = 'input',
    Output = 'output'
};

export enum ControlNames {
    NumericInput = 'Numeric Input',
    Slider = 'Slider',
    Knob = 'Knob',
    StaticNumericInput = 'Static Numeric Input',
    Dropdown = 'Dropdown',
    RadioButtonGroup = 'Radio Button Group',
    CheckboxButtonGroup = 'Checkbox Button Group',
    Plot = 'Plot',
    Control_Group = 'Control group'
}

export const OutputControlsManifest = [
    // Inputs
    {name: ControlNames.Plot, type: ControlTypes.Output}
]

export const InputControlsManifest = [
    // Outputs
    {name: ControlNames.NumericInput, type: ControlTypes.Input, minHeight: 1, minWidth: 1},
    {name: ControlNames.Slider, type: ControlTypes.Input, minHeight:1, minWidth:2},
    {name: ControlNames.Knob, type: ControlTypes.Input, minHeight:2, minWidth:1},
    {name: ControlNames.StaticNumericInput, type: ControlTypes.Input, minHeight:1, minWidth:2},
    {name: ControlNames.Dropdown, type: ControlTypes.Input, minHeight:1, minWidth:2},
    {name: ControlNames.RadioButtonGroup, type: ControlTypes.Input, minHeight:1, minWidth:2},
    {name: ControlNames.CheckboxButtonGroup, type: ControlTypes.Input, minHeight:1, minWidth:2},
    {name: ControlNames.Control_Group, type: ControlTypes.Input, minHeight:2, minWidth:2},
]