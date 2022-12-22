const lin2SineX = 192 + 99;
const sine2otherY = 42 + 175;
const sine2multiplyX = 115 + 117;
const sine2multiplyY = 30;
const multiply2AddX = 190 + 70;
const add2ScatterX = 99 + 127;

class NodePosition {
  constructor(
    private readonly START_POSITION_X: number,
    private readonly START_POSITION_Y: number
  ) {}
  linspace = {
    x: this.START_POSITION_X,
    y: this.START_POSITION_Y + sine2otherY,
  };
  sine = {
    x: this.START_POSITION_X + lin2SineX,
    y: this.START_POSITION_Y,
  };
  rand = {
    x: this.START_POSITION_X + lin2SineX,
    y: this.START_POSITION_Y + sine2otherY,
  };
  2 = {
    x: this.START_POSITION_X + lin2SineX,
    y: this.START_POSITION_Y + sine2otherY + 157,
  };
  multiply = {
    x: this.START_POSITION_X + lin2SineX + sine2multiplyX,
    y: this.START_POSITION_Y + sine2multiplyY,
  };
  add = {
    x: this.START_POSITION_X + lin2SineX + sine2multiplyX + multiply2AddX,
    y: this.START_POSITION_Y + sine2otherY,
  };
  scatter = {
    x:
      this.START_POSITION_X +
      lin2SineX +
      sine2multiplyX +
      multiply2AddX +
      add2ScatterX,
    y: this.START_POSITION_Y,
  };
  line = {
    x: this.scatter.x,
    y: this.scatter.y + 162,
  };
  histogram = {
    x:
      this.START_POSITION_X +
      lin2SineX +
      sine2multiplyX +
      multiply2AddX +
      add2ScatterX,
    // y: this.START_POSITION_Y + sine2otherY + sine2otherY - 42,
    y: this.line.y + 162,
  };
  surface3d = {
    x: this.scatter.x,
    y: this.histogram.y + 162,
  };
  scatter3d = {
    x: this.scatter.x,
    y: this.surface3d.y + 162,
  };
  bar = {
    x: this.scatter.x,
    y: this.scatter.y - 162,
  };
}

export const nodePosition = new NodePosition(0, 105);

export const NOISY_SINE = {
  elements: [
    {
      id: "SINE-userGeneratedNode_1646417316016",
      data: {
        label: "SINE",
        func: "SINE",
        type: "GENERATOR",
        ctrls: {
          SINE_SINE_frequency: {
            functionName: "SINE",
            param: "frequency",
            value: 1,
          },
          SINE_SINE_offset: { functionName: "SINE", param: "offset", value: 0 },
          SINE_SINE_amplitude: {
            functionName: "SINE",
            param: "amplitude",
            value: 1,
          },
          SINE_SINE_waveform: {
            functionName: "SINE",
            param: "waveform",
            value: "sine",
          },
        },
      },
      position: nodePosition.sine,
      type: "default",
    },
    {
      id: "MULTIPLY-userGeneratedNode_1646417352715",
      data: {
        label: "X",
        func: "MULTIPLY",
        type: "TRANSFORMER",
        ctrls: {},
        inputs: [
          {
            name: "y",
            id: "multiply_y",
          },
        ],
      },
      position: nodePosition.multiply,
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371398",
      data: { label: "RAND", func: "RAND", type: "GENERATOR", ctrls: {} },
      position: nodePosition.rand,
      type: "default",
    },
    {
      id: "ADD-userGeneratedNode_1646417428589",
      data: {
        label: "+",
        func: "ADD",
        type: "TRANSFORMER",
        ctrls: {},
        inputs: [
          {
            name: "y",
            id: "add_y",
          },
        ],
      },
      position: nodePosition.add,
      type: "default",
    },
    {
      id: "SCATTER-userGeneratedNode_1646417560399",
      data: { label: "SCATTER", func: "SCATTER", type: "VISOR", ctrls: {} },
      position: nodePosition.scatter,
      type: "default",
    },
    {
      id: "HISTOGRAM-userGeneratedNode_1646417604301",
      data: { label: "HISTOGRAM", func: "HISTOGRAM", type: "VISOR", ctrls: {} },
      position: nodePosition.histogram,
      type: "default",
    },
    {
      id: "LINSPACE-userGeneratedNode_1646432683694",
      data: {
        label: "Linspace",
        func: "LINSPACE",
        type: "GENERATOR",
        ctrls: {
          LINSPACE_Linspace_start: {
            functionName: "LINSPACE",
            param: "start",
            value: "10",
          },
          LINSPACE_Linspace_end: {
            functionName: "LINSPACE",
            param: "end",
            value: "0",
          },
          LINSPACE_Linspace_step: {
            functionName: "LINSPACE",
            param: "step",
            value: "1000",
          },
        },
      },
      position: nodePosition.linspace,
      type: "default",
    },
    {
      id: "2.0-userGeneratedNode_1646435677928",
      data: {
        label: "2.0",
        func: "CONSTANT",
        type: "GENERATOR",
        ctrls: {
          "CONSTANT_2.0_constant": {
            functionName: "CONSTANT",
            param: "constant",
            value: "3",
          },
        },
      },
      position: nodePosition[2],
      type: "default",
    },
    {
      id: "SCATTER3D-b63b2090-56f0-41c4-8048-1b34aa59c484",
      data: {
        label: "3D Scatter",
        func: "SCATTER3D",
        type: "VISOR",
        ctrls: {},
        inputs: [],
      },
      position: nodePosition.scatter3d,
    },
    {
      id: "SURFACE3D-5da867c0-be71-4f76-9f7c-5e53c0b7480d",
      data: {
        label: "3D Surface",
        func: "SURFACE3D",
        type: "VISOR",
        ctrls: {},
      },
      position: nodePosition.surface3d,
    },
    {
      id: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      data: {
        label: "Line",
        func: "LINE",
        type: "VISOR",
        ctrls: {},
      },
      position: nodePosition.line,
    },
    {
      id: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      data: {
        label: "Bar",
        func: "BAR",
        type: "VISOR",
        ctrls: {},
      },
      position: nodePosition.bar,
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: "SINE",
      animated: false,
      id: "reactflow__edge-LINSPACE-397f5e11-7559-457c-878f-4b6029cfbfb8null-SINE-3c918322-f469-4971-aee3-ab2603fe0885SINE",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "RAND-userGeneratedNode_1646417371398",
      targetHandle: "RAND",
      animated: false,
      id: "reactflow__edge-LINSPACE-397f5e11-7559-457c-878f-4b6029cfbfb8null-RAND-31ba3a7f-f33c-4811-aa24-8df85d590a20RAND",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "2.0-userGeneratedNode_1646435677928",
      targetHandle: "CONSTANT",
      animated: false,
      id: "reactflow__edge-LINSPACE-397f5e11-7559-457c-878f-4b6029cfbfb8null-CONSTANT-b4d8b0a2-09a6-4104-bbf8-3fee98cf7cb7CONSTANT",
    },
    {
      source: "SINE-userGeneratedNode_1646417316016",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-SINE-userGeneratedNode_1646417316016null-MULTIPLY-userGeneratedNode_1646417352715MULTIPLY",
    },
    // {
    //   source: "RAND-userGeneratedNode_1646417371398",
    //   sourceHandle: null,
    //   target: "MULTIPLY-userGeneratedNode_1646417352715",
    //   targetHandle: "MULTIPLY",
    //   id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715MULTIPLY",
    // },
    {
      source: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: "multiply_y",
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715multiply_y",
    },
    {
      source: "MULTIPLY-userGeneratedNode_1646417352715",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: "ADD",
      id: "reactflow__edge-MULTIPLY-userGeneratedNode_1646417352715null-ADD-userGeneratedNode_1646417428589ADD",
    },
    // {
    //   source: "2.0-userGeneratedNode_1646435677928",
    //   sourceHandle: null,
    //   target: "ADD-userGeneratedNode_1646417428589",
    //   targetHandle: "ADD",
    //   id: "reactflow__edge-2.0-userGeneratedNode_1646435677928null-ADD-userGeneratedNode_1646417428589ADD",
    // },
    {
      source: "2.0-userGeneratedNode_1646435677928",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: "add_y",
      id: "reactflow__edge-2.0-userGeneratedNode_1646435677928null-ADD-userGeneratedNode_1646417428589add_y",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SCATTER-userGeneratedNode_1646417560399",
      targetHandle: "SCATTER",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SCATTER-userGeneratedNode_1646417560399SCATTER",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "HISTOGRAM-userGeneratedNode_1646417604301",
      targetHandle: "HISTOGRAM",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-HISTOGRAM-userGeneratedNode_1646417604301HISTOGRAM",
    },

    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SCATTER3D-b63b2090-56f0-41c4-8048-1b34aa59c484",
      targetHandle: "SCATTER3D",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SCATTER3D-b63b2090-56f0-41c4-8048-1b34aa59c484SCATTER3D",
    },

    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SURFACE3D-5da867c0-be71-4f76-9f7c-5e53c0b7480d",
      targetHandle: "SURFACE3D",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SURFACE3D-5da867c0-be71-4f76-9f7c-5e53c0b7480dSURFACE3D",
    },

    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      targetHandle: "LINE",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9bLINE",
    },

    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      targetHandle: "BAR",
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-BAR-6106326f-ff85-4940-9f5b-018381e2e2ceBAR",
    },
  ],
  position: [0, 0],
  zoom: 0.8,
};

export const LOOP_APP = {
  elements: [
    {
      "id": "LINSPACE-userGeneratedNode_1646432683694",
      "data": {
        "label": "LINSPACE",
        "func": "LINSPACE",
        "type": "GENERATOR",
        "ctrls": {
          "LINSPACE_LINSPACE_start": {
            "functionName": "LINSPACE",
            "param": "start",
            "value": 1
          },
          "LINSPACE_LINSPACE_end": {
            "functionName": "LINSPACE",
            "param": "end",
            "value": 14
          },
          "LINSPACE_LINSPACE_step": {
            "functionName": "LINSPACE",
            "param": "step",
            "value": 3
          }
        }
      },
      "position": {
        "x": -61,
        "y": 268
      },
      "type": "default"
    },
    {
      "id": "LOOP-userGeneratedNode_1646417604301",
      "data": {
        "label": "LOOP",
        "func": "LOOP",
        "type": "LOOP",
        "ctrls": {
          "LOOP_LOOP_initial_count": {
            "value": 0,
            "param": "initial_count"
          },
          "LOOP_LOOP_iteration_count": {
            "value": 2,
            "param": "iteration_count"
          },
          "LOOP_LOOP_step":{
            "value":1,
            "param":"step"
          }
        },
        inputs: [
          {
            name: "end",
            id: "end"
          },
          {
            name: "body",
            id: "body",
          }
        ]
      },
      "position": {
        "x": 265,
        "y": 281
      },
      "type": "default"
    },
    {
      "id": "RAND-userGeneratedNode_1646417371398",
      "data": {
        "label": "RAND",
        "func": "RAND",
        "type": "GENERATOR",
        "ctrls": {

        }
      },
      "position": {
        "x": 550,
        "y": 619
      },
      "type": "default"
    },
    {
      "id": "MULTIPLY-userGeneratedNode_1646417352715",
      "data": {
        "label": "MULTIPLY",
        "func": "MULTIPLY",
        "type": "TRANSFORMER",
        "ctrls": {

        },
        inputs: [
          {
            name: "y",
            id: "multiply_y",
          },
        ],
      },
      "position": {
        "x": 715,
        "y": 495
      },
      "type": "default"
    },
    {
      "id": "CONDITIONAL-userGeneratedNode_1646435677929",
      "data": {
        "label": "CONDITIONAL",
        "func": "CONDITIONAL",
        "type": "COMPARATOR",
        "ctrls": {
          "CONDITIONAL_CONDITIONAL_operator_type": {
            "param": "operator_type",
            "value": "<="
          }
        }
      },
      "position": {
        "x": 900,
        "y": 426
      },
      "type": "default"
    },
    {
      id: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      data: {
        label: "Line",
        func: "LINE",
        type: "VISOR",
        ctrls: {},
      },
      position: {
        x: 901,
        y: 212
      },
    },
    {
      id: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      data: {
        label: "Bar",
        func: "BAR",
        type: "VISOR",
        ctrls: {},
      },
      position: {
        x: 907,
        y: -16
      },
    },
    {
      "source": "LINSPACE-userGeneratedNode_1646432683694",
      "sourceHandle": null,
      "target": "LOOP-userGeneratedNode_1646417604301",
      "targetHandle": null,
      "id": "LINSPACE-userGeneratedNode_1646432683694null-LOOP-userGeneratedNode_1646417604301null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "LOOP-userGeneratedNode_1646417604301",
      "targetHandle": null,
      "target": "RAND-userGeneratedNode_1646417371398",
      "sourceHandle": "body",
      "id": "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-RAND-userGeneratedNode_1646417371398null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "LOOP-userGeneratedNode_1646417604301",
      "sourceHandle": "body",
      "target": "MULTIPLY-userGeneratedNode_1646417352715",
      "targetHandle": null,
      "id": "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-MULTIPLY-userGeneratedNode_1646417352715null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "LOOP-userGeneratedNode_1646417604301",
      "sourceHandle": "body",
      "target": "CONDITIONAL-userGeneratedNode_1646435677929",
      "targetHandle": null,
      "id": "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-CONDITIONAL-userGeneratedNode_1646435677929null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "RAND-userGeneratedNode_1646417371398",
      "sourceHandle": null,
      "target": "MULTIPLY-userGeneratedNode_1646417352715",
      "targetHandle": "multiply_y",
      "id": "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "MULTIPLY-userGeneratedNode_1646417352715",
      "sourceHandle": null,
      "target": "CONDITIONAL-userGeneratedNode_1646435677929",
      "targetHandle": null,
      "id": "reactflow__edge-MULTIPLY-userGeneratedNode_1646417352715null-CONDITIONAL-userGeneratedNode_1646435677929null",
      "type": "default",
      "label":"default"
    },
    {
      "source": "LOOP-userGeneratedNode_1646417604301",
      "sourceHandle": "end",
      "target": "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      "targetHandle": null,
      "id": "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9bnull",
      "type": "default",
      "label":"true"
    },
    {
      "source": "LOOP-userGeneratedNode_1646417604301",
      "sourceHandle": "end",
      "target": "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      "targetHandle": null,
      "id": "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-BAR-6106326f-ff85-4940-9f5b-018381e2e2cenull",
      "type": "default",
      "label":"true"
    },
  ],
  "position": [
    0,
    0
  ],
  "zoom": 1
}
