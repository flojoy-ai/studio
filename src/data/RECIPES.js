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

export const NOISY_SINEss = {
  elements: [
    {
      id: "SINE-userGeneratedNode_1646417316016",
      data: {
        label: "SINE",
        func: "SINE",
        type: "GENERATOR",
        ctrls: {
          SINE_FREQUENCY: {
            functionName: "SINE",
            param: "frequency",
            value: 15,
          },
        },
        selects: {
          "handle-0": "smoothstep",
          "handle-1": "smoothstep",
        },
      },
      position: nodePosition.sine,
      type: "default",
    },
    {
      id: "MULTIPLY-userGeneratedNode_1646417352715",
      data: {
        label: "MULTIPLY",
        func: "MULTIPLY",
        type: "TRANSFORMER",
        ctrls: {},
      },
      position: nodePosition.multiply,
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371398",
      data: {
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
        label: "ADD",
        func: "ADD",
        type: "TRANSFORMER",
        ctrls: {},
      },
      position: nodePosition.add,
      type: "default",
    },
    {
      id: "SCATTER-userGeneratedNode_1646417560399",
      data: {
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
        label: "LINSPACE",
        func: "LINSPACE",
        type: "GENERATOR",
        ctrls: {},
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
        ctrls: {},
      },
      position: nodePosition[2],
      type: "default",
    },
    {
      source: "SINE-userGeneratedNode_1646417316016",
      sourceHandle: null,
      // data: {
      //   selectIndex: 0,
      // },
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-SINE-userGeneratedNode_1646417316016null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
      animated: true,
    },

    {
      source: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
      animated: true,
    },
    {
      source: "MULTIPLY-userGeneratedNode_1646417352715",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      id: "reactflow__edge-MULTIPLY-userGeneratedNode_1646417352715null-ADD-userGeneratedNode_1646417428589null",
      type: "default",
      animated: true,
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SCATTER-userGeneratedNode_1646417560399",
      targetHandle: null,
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SCATTER-userGeneratedNode_1646417560399null",
      type: "default",
      animated: true,
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "HISTOGRAM-userGeneratedNode_1646417604301",
      targetHandle: null,
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-HISTOGRAM-userGeneratedNode_1646417604301null",
      type: "default",
      animated: true,
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016null",
      type: "default",
      animated: true,
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "RAND-userGeneratedNode_1646417371398",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-RAND-userGeneratedNode_1646417371398null",
      type: "default",
      animated: true,
    },
    {
      source: "2.0-userGeneratedNode_1646435677928",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      id: "reactflow__edge-2.0-userGeneratedNode_1646435677928null-ADD-userGeneratedNode_1646417428589null",
      type: "default",
      animated: true,
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "2.0-userGeneratedNode_1646435677928",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-2.0-userGeneratedNode_1646435677928null",
      type: "default",
      animated: true,
    },
  ],
  position: [0, 0],
  zoom: 1,
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
      data: { label: "X", func: "MULTIPLY", type: "TRANSFORMER", ctrls: {} },
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
      data: { label: "+", func: "ADD", type: "TRANSFORMER", ctrls: {} },
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
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-SINE-3c918322-f469-4971-aee3-ab2603fe0885null-MULTIPLY-7520bc1c-8be7-415d-a790-3e57bc7d884dnull",
    },
    {
      source: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-RAND-31ba3a7f-f33c-4811-aa24-8df85d590a20null-MULTIPLY-7520bc1c-8be7-415d-a790-3e57bc7d884dnull",
    },
    {
      source: "2.0-userGeneratedNode_1646435677928",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-CONSTANT-b4d8b0a2-09a6-4104-bbf8-3fee98cf7cb7null-MULTIPLY-7520bc1c-8be7-415d-a790-3e57bc7d884dnull",
    },
    {
      source: "MULTIPLY-userGeneratedNode_1646417352715",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-MULTIPLY-7520bc1c-8be7-415d-a790-3e57bc7d884dnull-ADD-919b4fd2-6c40-485a-8070-60145b7c4773null",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SCATTER-userGeneratedNode_1646417560399",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-ADD-919b4fd2-6c40-485a-8070-60145b7c4773null-SCATTER-48b4a6ea-a7cf-44a5-b436-95c5b08542e4null",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "HISTOGRAM-userGeneratedNode_1646417604301",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-ADD-919b4fd2-6c40-485a-8070-60145b7c4773null-HISTOGRAM-0cb1b11b-e9ca-42ed-84a6-272125fd4062null",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: "frequency",
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016frequency",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: "offset",
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016offset",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: "amplitude",
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016amplitude",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: "waveform",
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016waveform",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "2.0-userGeneratedNode_1646435677928",
      targetHandle: "constant",
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-2.0-userGeneratedNode_1646435677928constant",
    },
  ],
  position: [0, 0],
  zoom: 1,
};
