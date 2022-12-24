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
        id: "SINE-userGeneratedNode_1646417316016",
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
        id: "MULTIPLY-userGeneratedNode_1646417352715",

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
      data: {
        id: "RAND-userGeneratedNode_1646417371398",

        label: "RAND",
        func: "RAND",
        type: "GENERATOR",
        ctrls: {},
      },
      position: nodePosition.rand,
      type: "default",
    },
    {
      id: "ADD-userGeneratedNode_1646417428589",
      data: {
        id: "ADD-userGeneratedNode_1646417428589",

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
      data: {
        id: "SCATTER-userGeneratedNode_1646417560399",

        label: "SCATTER",
        func: "SCATTER",
        type: "VISOR",
        ctrls: {},
      },
      position: nodePosition.scatter,
      type: "default",
    },
    {
      id: "HISTOGRAM-userGeneratedNode_1646417604301",
      data: {
        id: "HISTOGRAM-userGeneratedNode_1646417604301",

        label: "HISTOGRAM",
        func: "HISTOGRAM",
        type: "VISOR",
        ctrls: {},
      },
      position: nodePosition.histogram,
      type: "default",
    },
    {
      id: "LINSPACE-userGeneratedNode_1646432683694",
      data: {
        id: "LINSPACE-userGeneratedNode_1646432683694",

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
        id: "2.0-userGeneratedNode_1646435677928",

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
        id: "SCATTER3D-b63b2090-56f0-41c4-8048-1b34aa59c484",

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
        id: "SURFACE3D-5da867c0-be71-4f76-9f7c-5e53c0b7480d",

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
        id: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",

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
        id: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",

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
      targetHandle: "MULTIPLY",
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
