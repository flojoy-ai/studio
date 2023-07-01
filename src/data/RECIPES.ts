export const NOISY_SINE = {
  nodes: [
    {
      width: 150,
      height: 150,
      id: "LINSPACE-22778026-3401-412e-bef7-6a8cd27549cb",
      type: "default",
      data: {
        id: "LINSPACE-22778026-3401-412e-bef7-6a8cd27549cb",
        label: "LINSPACE",
        func: "LINSPACE",
        type: "default",
        ctrls: {
          start: {
            type: "float",
            default: 10,
            functionName: "LINSPACE",
            param: "start",
            value: 10,
          },
          end: {
            type: "float",
            default: 0,
            functionName: "LINSPACE",
            param: "end",
            value: 0,
          },
          step: {
            type: "int",
            default: 1000,
            functionName: "LINSPACE",
            param: "step",
            value: 1000,
          },
        },
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\GENERATORS\\SIMULATIONS\\LINSPACE\\LINSPACE.py",
        selected: false,
      },
      position: {
        x: -170.58822111992225,
        y: 204.02705031953082,
      },
      selected: false,
      positionAbsolute: {
        x: -170.58822111992225,
        y: 204.02705031953082,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcb",
      type: "SIMULATIONS",
      data: {
        id: "SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcb",
        label: "SINE",
        func: "SINE",
        type: "SIMULATIONS",
        ctrls: {
          amplitude: {
            type: "float",
            default: 1,
            functionName: "SINE",
            param: "amplitude",
            value: 1,
          },
          frequency: {
            type: "float",
            default: 1,
            functionName: "SINE",
            param: "frequency",
            value: 1,
          },
          offset: {
            type: "float",
            default: 0,
            functionName: "SINE",
            param: "offset",
            value: 0,
          },
          phase: {
            type: "float",
            default: 0,
            functionName: "SINE",
            param: "phase",
            value: 0,
          },
          waveform: {
            type: "select",
            default: "sine",
            options: ["sine", "square", "triangle", "sawtooth"],
            functionName: "SINE",
            param: "waveform",
            value: "sine",
          },
        },
        inputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\GENERATORS\\SIMULATIONS\\SINE\\SINE.py",
        selected: false,
      },
      position: {
        x: 235.42623781875193,
        y: -12.60551234186579,
      },
      selected: false,
      positionAbsolute: {
        x: 235.42623781875193,
        y: -12.60551234186579,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12",
      type: "SIMULATIONS",
      data: {
        id: "RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12",
        label: "RAND",
        func: "RAND",
        type: "SIMULATIONS",
        ctrls: {},
        inputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\GENERATORS\\SIMULATIONS\\RAND\\RAND.py",
        selected: false,
      },
      position: {
        x: 235.54630710850722,
        y: 214.1771369317251,
      },
      selected: false,
      positionAbsolute: {
        x: 235.54630710850722,
        y: 214.1771369317251,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fe",
      type: "SIMULATIONS",
      data: {
        id: "CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fe",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATIONS",
        ctrls: {
          constant: {
            type: "float",
            default: 3,
            functionName: "CONSTANT",
            param: "constant",
            value: "2.0",
          },
        },
        inputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\GENERATORS\\SIMULATIONS\\CONSTANT\\CONSTANT.py",
        selected: false,
      },
      position: {
        x: 229.77198674934385,
        y: 463.03647867904886,
      },
      selected: false,
      positionAbsolute: {
        x: 229.77198674934385,
        y: 463.03647867904886,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 130,
      id: "MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8f",
      type: "ARITHMETIC",
      data: {
        id: "MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8f",
        label: "MULTIPLY",
        func: "MULTIPLY",
        type: "ARITHMETIC",
        ctrls: {},
        inputs: [
          {
            name: "a",
            id: "a",
            type: "OrderedPair",
          },
          {
            name: "b",
            id: "b",
            type: "OrderedPair",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\TRANSFORMERS\\ARITHMETIC\\MULTIPLY\\MULTIPLY.py",
        selected: false,
      },
      position: {
        x: 530.8826276795811,
        y: 91.25995942970451,
      },
      selected: false,
      positionAbsolute: {
        x: 530.8826276795811,
        y: 91.25995942970451,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 130,
      id: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
      type: "ARITHMETIC",
      data: {
        id: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
        label: "ADD",
        func: "ADD",
        type: "ARITHMETIC",
        ctrls: {},
        inputs: [
          {
            name: "a",
            id: "a",
            type: "OrderedPair",
          },
          {
            name: "b",
            id: "b",
            type: "OrderedPair",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair",
          },
        ],
        path: "PYTHON/nodes\\TRANSFORMERS\\ARITHMETIC\\ADD\\ADD.py",
        selected: false,
      },
      position: {
        x: 742.0710605286419,
        y: 263.6968597727035,
      },
      selected: false,
      positionAbsolute: {
        x: 742.0710605286419,
        y: 263.6968597727035,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 167,
      id: "HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddb",
      type: "PLOTLY",
      data: {
        id: "HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddb",
        label: "HISTOGRAM",
        func: "HISTOGRAM",
        type: "PLOTLY",
        ctrls: {},
        inputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair|DataFrame|Matrix",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "Plotly",
          },
        ],
        path: "PYTHON/nodes\\VISUALIZERS\\PLOTLY\\HISTOGRAM\\HISTOGRAM.py",
        selected: false,
      },
      position: {
        x: 963.8775971004252,
        y: -20.636629109395187,
      },
      selected: false,
      positionAbsolute: {
        x: 963.8775971004252,
        y: -20.636629109395187,
      },
      dragging: true,
    },
    {
      width: 225,
      height: 234,
      id: "SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9",
      type: "PLOTLY",
      data: {
        id: "SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9",
        label: "SCATTER",
        func: "SCATTER",
        type: "PLOTLY",
        ctrls: {},
        inputs: [
          {
            name: "default",
            id: "default",
            type: "OrderedPair|DataFrame|Matrix",
          },
        ],
        outputs: [
          {
            name: "default",
            id: "default",
            type: "Plotly",
          },
        ],
        path: "PYTHON/nodes\\VISUALIZERS\\PLOTLY\\SCATTER\\SCATTER.py",
        selected: false,
      },
      position: {
        x: 984.9759779821693,
        y: 372.02814976462133,
      },
      selected: false,
      positionAbsolute: {
        x: 984.9759779821693,
        y: 372.02814976462133,
      },
      dragging: true,
    },
    {
      width: 210,
      height: 130,
      id: "END-c045d961-1c92-43d5-bd09-a21daea32d80",
      type: "TERMINATOR",
      data: {
        id: "END-c045d961-1c92-43d5-bd09-a21daea32d80",
        label: "END",
        func: "END",
        type: "TERMINATOR",
        ctrls: {},
        inputs: [
          {
            name: "default",
            id: "default",
            type: "any",
          },
        ],
        outputs: [],
        path: "PYTHON/nodes\\LOGIC_GATES\\TERMINATORS\\END\\END.py",
        selected: false,
      },
      position: {
        x: 1450.8403503086492,
        y: 258.82305908670554,
      },
      selected: false,
      positionAbsolute: {
        x: 1450.8403503086492,
        y: 258.82305908670554,
      },
      dragging: true,
    },
  ],
  edges: [
    {
      source: "LINSPACE-22778026-3401-412e-bef7-6a8cd27549cb",
      sourceHandle: "default",
      target: "SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcb",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-22778026-3401-412e-bef7-6a8cd27549cbdefault-SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcbdefault",
    },
    {
      source: "LINSPACE-22778026-3401-412e-bef7-6a8cd27549cb",
      sourceHandle: "default",
      target: "RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-22778026-3401-412e-bef7-6a8cd27549cbdefault-RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12default",
    },
    {
      source: "LINSPACE-22778026-3401-412e-bef7-6a8cd27549cb",
      sourceHandle: "default",
      target: "CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fe",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-22778026-3401-412e-bef7-6a8cd27549cbdefault-CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fedefault",
    },
    {
      source: "CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fe",
      sourceHandle: "default",
      target: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
      targetHandle: "b",
      id: "reactflow__edge-CONSTANT-9c20a000-32cb-443a-b1a9-aac6b59ab7fedefault-ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201b",
    },
    {
      source: "SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcb",
      sourceHandle: "default",
      target: "MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8f",
      targetHandle: "a",
      id: "reactflow__edge-SINE-24fa282d-3d52-44bd-b7ce-8b88cc10ffcbdefault-MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8fa",
    },
    {
      source: "RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12",
      sourceHandle: "default",
      target: "MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8f",
      targetHandle: "b",
      id: "reactflow__edge-RAND-301912f2-06c3-43dd-b3bc-9a7740f88f12default-MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8fb",
    },
    {
      source: "MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8f",
      sourceHandle: "default",
      target: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
      targetHandle: "a",
      id: "reactflow__edge-MULTIPLY-cb5f410d-1cc0-48c4-afdf-ec41111f1b8fdefault-ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201a",
    },
    {
      source: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
      sourceHandle: "default",
      target: "HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddb",
      targetHandle: "default",
      id: "reactflow__edge-ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201default-HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddbdefault",
    },
    {
      source: "ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201",
      sourceHandle: "default",
      target: "SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9",
      targetHandle: "default",
      id: "reactflow__edge-ADD-cf61d526-9f96-4fe5-844a-ea99f5a85201default-SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9default",
    },
    {
      source: "SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9",
      sourceHandle: "default",
      target: "END-c045d961-1c92-43d5-bd09-a21daea32d80",
      targetHandle: "default",
      id: "reactflow__edge-SCATTER-ec057d1c-25b7-433d-8ecb-9e34602972f9default-END-c045d961-1c92-43d5-bd09-a21daea32d80default",
    },
    {
      source: "HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddb",
      sourceHandle: "default",
      target: "END-c045d961-1c92-43d5-bd09-a21daea32d80",
      targetHandle: "default",
      id: "reactflow__edge-HISTOGRAM-8f8fa933-d257-4fe7-882c-5f7facc39ddbdefault-END-c045d961-1c92-43d5-bd09-a21daea32d80default",
    },
  ],
  viewport: {
    x: -517.8704364705238,
    y: -89.45084981424128,
    zoom: 0.7630160254043277,
  },
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
        type: "ARITHMETIC",
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
        type: "PLOTLY_VISOR",
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
        type: "PLOTLY_VISOR",
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
        type: "PLOTLY_VISOR",
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
        type: "PLOTLY_VISOR",
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

export const OBJECT_DETECTION = {
  elements: [
    {
      id: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
      type: "default",
      position: {
        x: 1136.6444964153716,
        y: 132.0527524900669,
      },
      data: {
        id: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
        label: "Object Detection",
        func: "OBJECT_DETECTION",
        type: "SIMULATION",
        ctrls: {},
      },
    },
    {
      id: "LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68c",
      type: "default",
      position: {
        x: 228.09710889449232,
        y: 129.01818849474336,
      },
      data: {
        id: "LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68c",
        label: "File Loader",
        func: "LOCAL_FILE",
        type: "LOADER",
        ctrls: {
          LOCAL_FILE_file_file_type: {
            functionName: "LOCAL_FILE",
            param: "file_type",
            value: "image",
          },
          LOCAL_FILE_file_op_type: {
            functionName: "LOCAL_FILE",
            param: "op_type",
            value: "OD",
          },
          LOCAL_FILE_file_path: {
            functionName: "LOCAL_FILE",
            param: "path",
            value: "",
          },
        },
      },
    },
    {
      source: "LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68c",
      sourceHandle: "main",
      target: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
      targetHandle: "OBJECT_DETECTION",
      id: "reactflow__edge-LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68cmain-OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1adOBJECT_DETECTION",
    },
  ],
  position: [0, 0],
  zoom: 1,
};

export const EMPTY_CANVAS = {
  elements: [],
  position: [0, 0],
  zoom: 0.8,
};
