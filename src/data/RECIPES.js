const START_POSITION_X = 0;
const START_POSITION_Y = 105;
const lin2SineX = 192 + 99;
const sine2otherY = 42 + 115;
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
    y: START_POSITION_Y + sine2otherY + sine2otherY,
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
        func: 'SINE',
        type: "GENERATOR",
        ctrls: {},
      },
      position: nodePosition.sine,
      type: "default",
    },
    {
      id: "MULTIPLY-userGeneratedNode_1646417352715",
      data: {
        label: "MULTIPLY",
        func: 'MULTIPLY',
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
        func: 'RAND',
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
        func: 'ADD',
        type: "TRANSFORMER",
        ctrls: {},
      },
      position:nodePosition.add,
      type: "default",
    },
    {
      id: "SCATTER-userGeneratedNode_1646417560399",
      data: {
        label: "SCATTER",
        func: 'SCATTER',
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
        func: 'HISTOGRAM',
        type: "VISOR",
        ctrls: {},
      },
      position:nodePosition.histogram,
      type: "default",
    },
    {
      id: "LINSPACE-userGeneratedNode_1646432683694",
      data: {
        label: "LINSPACE",
        func: 'LINSPACE',
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
        func: 'CONSTANT',
        type: "GENERATOR",
        ctrls: {},
      },
      position: nodePosition[2],
      type: "default",
    },
    {
      source: "SINE-userGeneratedNode_1646417316016",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-SINE-userGeneratedNode_1646417316016null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
    },
    {
      source: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
    },
    {
      source: "MULTIPLY-userGeneratedNode_1646417352715",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      id: "reactflow__edge-MULTIPLY-userGeneratedNode_1646417352715null-ADD-userGeneratedNode_1646417428589null",
      type: "default",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "SCATTER-userGeneratedNode_1646417560399",
      targetHandle: null,
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SCATTER-userGeneratedNode_1646417560399null",
      type: "default",
    },
    {
      source: "ADD-userGeneratedNode_1646417428589",
      sourceHandle: null,
      target: "HISTOGRAM-userGeneratedNode_1646417604301",
      targetHandle: null,
      id: "reactflow__edge-ADD-userGeneratedNode_1646417428589null-HISTOGRAM-userGeneratedNode_1646417604301null",
      type: "default",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "SINE-userGeneratedNode_1646417316016",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016null",
      type: "default",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "RAND-userGeneratedNode_1646417371398",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-RAND-userGeneratedNode_1646417371398null",
      type: "default",
    },
    {
      source: "2.0-userGeneratedNode_1646435677928",
      sourceHandle: null,
      target: "ADD-userGeneratedNode_1646417428589",
      targetHandle: null,
      id: "reactflow__edge-2.0-userGeneratedNode_1646435677928null-ADD-userGeneratedNode_1646417428589null",
      type: "default",
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "2.0-userGeneratedNode_1646435677928",
      targetHandle: null,
      id: "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-2.0-userGeneratedNode_1646435677928null",
      type: "default",
    },
  ],
  position: [0, 0],
  zoom: 1,
};
