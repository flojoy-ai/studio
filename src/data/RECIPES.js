const START_POSITION_X = 0;
const START_POSITION_Y = 105;
const lin2SineX = 192 + 99;
const sine2otherY = 42 + 175;
const sine2multiplyX = 115 + 117;
const sine2multiplyY = 30;
const multiply2AddX = 190 + 70;
const add2ScatterX = 99 + 127;

const nodePosition = {
  linspace: {
    x: START_POSITION_X,
    y: START_POSITION_Y + sine2otherY,
  },
  sine: {
    x: START_POSITION_X + lin2SineX,
    y: START_POSITION_Y,
  },
  rand: {
    x: START_POSITION_X + lin2SineX,
    y: START_POSITION_Y + sine2otherY,
  },
  2: {
    x: START_POSITION_X + lin2SineX,
    y: START_POSITION_Y + sine2otherY + 157,
  },
  multiply: {
    x: START_POSITION_X + lin2SineX + sine2multiplyX,
    y: START_POSITION_Y + sine2multiplyY,
  },
  add: {
    x: START_POSITION_X + lin2SineX + sine2multiplyX + multiply2AddX,
    y: START_POSITION_Y + sine2otherY,
  },
  scatter: {
    x:
      START_POSITION_X +
      lin2SineX +
      sine2multiplyX +
      multiply2AddX +
      add2ScatterX,
    y: START_POSITION_Y,
  },
  histogram: {
    x:
      START_POSITION_X +
      lin2SineX +
      sine2multiplyX +
      multiply2AddX +
      add2ScatterX,
    y: START_POSITION_Y + sine2otherY + sine2otherY - 42,
  },
};

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
          "CONSTANT_2.0_CONSTANT": {
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
  ],
  position: [0, 0],
  zoom: 1,
};
