export const NOISY_SINE = {
  nodes: [
    {
      id: "SINE-userGeneratedNode_1646417316016",
      data: {
        id: "SINE-userGeneratedNode_1646417316016",
        label: "SINE",
        func: "SINE",
        type: "SIMULATION",
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
      position: { x: 291, y: 105 },
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
        inputs: [{ name: "y", id: "multiply_y", type: "source" }],
      },
      position: { x: 523, y: 135 },
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371398",
      data: {
        id: "RAND-userGeneratedNode_1646417371398",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: { x: 291, y: 322 },
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
        inputs: [{ name: "y", id: "add_y", type: "source" }],
      },
      position: { x: 783, y: 322 },
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
      position: { x: 1009, y: 105 },
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
      position: { x: 1009, y: 429 },
      type: "default",
    },
    {
      id: "LINSPACE-userGeneratedNode_1646432683694",
      data: {
        id: "LINSPACE-userGeneratedNode_1646432683694",
        label: "Linspace",
        func: "LINSPACE",
        type: "SIMULATION",
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
      position: { x: 0, y: 322 },
      type: "default",
    },
    {
      id: "2.0-userGeneratedNode_1646435677928",
      data: {
        id: "2.0-userGeneratedNode_1646435677928",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
        ctrls: {
          "CONSTANT_2.0_constant": {
            functionName: "CONSTANT",
            param: "constant",
            value: "3",
          },
        },
      },
      position: { x: 291, y: 479 },
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
      position: { x: 1009, y: 753 },
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
      position: { x: 1009, y: 591 },
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
      position: { x: 1009, y: 267 },
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
      position: { x: 1009, y: -57 },
    },
  ],
  edges: [
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
};

export const LOOP_APP = {
  elements: [
    {
      id: "LINSPACE-userGeneratedNode_1646432683694",
      data: {
        id: "LINSPACE-userGeneratedNode_1646432683694",
        label: "LINSPACE",
        func: "LINSPACE",
        type: "SIMULATION",
        ctrls: {
          LINSPACE_LINSPACE_start: {
            functionName: "LINSPACE",
            param: "start",
            value: 1,
          },
          LINSPACE_LINSPACE_end: {
            functionName: "LINSPACE",
            param: "end",
            value: 14,
          },
          LINSPACE_LINSPACE_step: {
            functionName: "LINSPACE",
            param: "step",
            value: 3,
          },
        },
      },
      position: {
        x: -61,
        y: 268,
      },
      type: "default",
    },
    {
      id: "LOOP-userGeneratedNode_1646417604301",
      data: {
        id: "LOOP-userGeneratedNode_1646417604301",
        label: "LOOP",
        func: "LOOP",
        type: "LOOP",
        ctrls: {
          LOOP_LOOP_initial_count: {
            value: 0,
            param: "initial_count",
          },
          LOOP_LOOP_iteration_count: {
            value: 2,
            param: "iteration_count",
          },
          LOOP_LOOP_step: {
            value: 1,
            param: "step",
          },
        },
        inputs: [
          {
            name: "end",
            id: "end",
          },
          {
            name: "body",
            id: "body",
          },
        ],
      },
      position: {
        x: 265,
        y: 281,
      },
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371398",
      data: {
        id: "RAND-userGeneratedNode_1646417371398",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 550,
        y: 619,
      },
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371399",
      data: {
        id: "RAND-userGeneratedNode_1646417371399",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 550,
        y: 619,
      },
      type: "default",
    },
    {
      id: "MULTIPLY-userGeneratedNode_1646417352715",
      data: {
        id: "MULTIPLY-userGeneratedNode_1646417352715",
        label: "MULTIPLY",
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
      position: {
        x: 715,
        y: 495,
      },
      type: "default",
    },
    {
      id: "CONDITIONAL-userGeneratedNode_1646435677929",
      data: {
        id: "CONDITIONAL-userGeneratedNode_1646435677929",
        label: "CONDITIONAL",
        func: "CONDITIONAL",
        type: "COMPARATOR",
        ctrls: {
          CONDITIONAL_CONDITIONAL_operator_type: {
            param: "operator_type",
            value: ">",
          },
        },
        inputs: [
          {
            name: "x",
            id: "first",
          },
          {
            name: "y",
            id: "second",
          },
        ],
      },
      position: {
        x: 900,
        y: 426,
      },
      type: "default",
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
      position: {
        x: 901,
        y: 212,
      },
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
      position: {
        x: 907,
        y: -16,
      },
    },
    {
      source: "LINSPACE-userGeneratedNode_1646432683694",
      sourceHandle: null,
      target: "LOOP-userGeneratedNode_1646417604301",
      targetHandle: null,
      id: "LINSPACE-userGeneratedNode_1646432683694null-LOOP-userGeneratedNode_1646417604301null",
      type: "default",
    },
    {
      source: "LOOP-userGeneratedNode_1646417604301",
      targetHandle: null,
      target: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: "body",
      id: "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-RAND-userGeneratedNode_1646417371398null",
      type: "default",
    },
    {
      source: "LOOP-userGeneratedNode_1646417604301",
      sourceHandle: "body",
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: null,
      id: "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
    },
    {
      source: "LOOP-userGeneratedNode_1646417604301",
      sourceHandle: "body",
      target: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: null,
      id: "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-CONDITIONAL-userGeneratedNode_1646435677929null",
      type: "default",
    },
    {
      source: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      target: "MULTIPLY-userGeneratedNode_1646417352715",
      targetHandle: "multiply_y",
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715null",
      type: "default",
    },
    {
      source: "MULTIPLY-userGeneratedNode_1646417352715",
      sourceHandle: null,
      target: "RAND-userGeneratedNode_1646417371399",
      targetHandle: null,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371399null-RAND-userGeneratedNode_1646417371399null",
      type: "default",
    },
    {
      source: "RAND-userGeneratedNode_1646417371399",
      sourceHandle: null,
      target: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: null,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371399null-CONDITIONAL-userGeneratedNode_1646435677929null",
      type: "default",
    },
    {
      source: "LOOP-userGeneratedNode_1646417604301",
      sourceHandle: "end",
      target: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      targetHandle: null,
      id: "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9bnull",
      type: "default",
    },
    {
      source: "LOOP-userGeneratedNode_1646417604301",
      sourceHandle: "end",
      target: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      targetHandle: null,
      id: "reactflow__edge-LOOP-userGeneratedNode_1646417604301null-BAR-6106326f-ff85-4940-9f5b-018381e2e2cenull",
      type: "default",
    },
  ],
  position: [0, 0],
  zoom: 1,
};

export const CONDITIONAL = {
  elements: [
    {
      id: "2.0-userGeneratedNode_1646435677928",
      data: {
        id: "2.0-userGeneratedNode_1646435677928",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
        ctrls: {
          "CONSTANT_2.0_constant": {
            functionName: "CONSTANT",
            param: "constant",
            value: "3",
          },
        },
      },
      position: {
        x: 96,
        y: 46,
      },
      type: "default",
    },
    {
      id: "2.0-userGeneratedNode_1646435677929",
      data: {
        id: "2.0-userGeneratedNode_1646435677929",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
        ctrls: {
          "CONSTANT_2.0_constant": {
            functionName: "CONSTANT",
            param: "constant",
            value: "4",
          },
        },
      },
      position: {
        x: 145,
        y: 400,
      },
      type: "default",
    },
    {
      id: "CONDITIONAL-userGeneratedNode_1646435677929",
      data: {
        id: "CONDITIONAL-userGeneratedNode_1646435677929",
        label: "CONDITIONAL",
        func: "CONDITIONAL",
        type: "COMPARATOR",
        ctrls: {
          CONDITIONAL_CONDITIONAL_operator_type: {
            param: "operator_type",
            value: ">",
          },
        },
        inputs: [
          {
            name: "x",
            id: "first",
          },
          {
            name: "y",
            id: "second",
          },
        ],
      },
      position: {
        x: 500,
        y: 218,
      },
      type: "default",
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
      position: {
        x: 1203,
        y: 308,
      },
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
      position: {
        x: 1157,
        y: -48,
      },
    },
    {
      id: "TIMER-userGeneratedNode_1646435677929",
      data: {
        id: "TIMER-userGeneratedNode_1646435677929",
        label: "TIMER",
        func: "TIMER",
        type: "TIMER",
        ctrls: {
          TIMER_TIMER_sleep_time: {
            param: "sleep_time",
            value: 3,
          },
        },
      },
      position: {
        x: 256,
        y: 146,
      },
    },
    {
      id: "RAND-userGeneratedNode_1646417371398",
      data: {
        id: "RAND-userGeneratedNode_1646417371398",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 887,
        y: 393,
      },
      type: "default",
    },
    {
      id: "RAND-userGeneratedNode_1646417371399",
      data: {
        id: "RAND-userGeneratedNode_1646417371399",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 897,
        y: 59,
      },
      type: "default",
    },
    {
      source: "2.0-userGeneratedNode_1646435677928",
      sourceHandle: null,
      target: "TIMER-userGeneratedNode_1646435677929",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-2.0-userGeneratedNode_1646435677928null-TIMER-userGeneratedNode_1646435677929null",
    },
    {
      source: "TIMER-userGeneratedNode_1646435677929",
      sourceHandle: null,
      target: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: "first",
      animated: false,
      id: "reactflow__edge-TIMER-userGeneratedNode_1646435677929null-CONDITIONAL-userGeneratedNode_1646435677929null",
    },
    {
      source: "2.0-userGeneratedNode_1646435677929",
      sourceHandle: null,
      target: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: "second",
      animated: false,
      id: "reactflow__edge-2.0-userGeneratedNode_1646435677929null-CONDITIONAL-userGeneratedNode_1646435677929null",
    },
    {
      target: "RAND-userGeneratedNode_1646417371398",
      sourceHandle: null,
      source: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: null,
      animated: false,
      label: "True",
      id: "reactflow__edge-CONDITIONAL-userGeneratedNode_1646435677929null-RAND-userGeneratedNode_1646417371398null",
    },
    {
      target: "RAND-userGeneratedNode_1646417371399",
      sourceHandle: null,
      source: "CONDITIONAL-userGeneratedNode_1646435677929",
      targetHandle: null,
      animated: false,
      label: "False",
      id: "reactflow__edge-CONDITIONAL-userGeneratedNode_1646435677929null-RAND-userGeneratedNode_1646417371399null",
    },
    {
      target: "LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9b",
      sourceHandle: null,
      source: "RAND-userGeneratedNode_1646417371398",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371398null-LINE-bdff1fc7-4e1d-4a3a-aa0b-d86fe514fa9bnull",
    },
    {
      target: "BAR-6106326f-ff85-4940-9f5b-018381e2e2ce",
      sourceHandle: null,
      source: "RAND-userGeneratedNode_1646417371399",
      targetHandle: null,
      animated: false,
      id: "reactflow__edge-RAND-userGeneratedNode_1646417371399null-BAR-6106326f-ff85-4940-9f5b-018381e2e2cenull",
    },
  ],
  position: [0, 0],
  zoom: 0.8,
};

export const EMPTY_CANVAS = {
  elements: [],
  position: [0, 0],
  zoom: 0.8,
};
