// TODO: Regenerate this (currently broken)

export const NOISY_SINE = {
  nodes: [
    {
      width: 150,
      height: 150,
      id: "LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7c",
      type: "default",
      data: {
        id: "LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7c",
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
        x: 766.6435908098493,
        y: 409.9314708995975,
      },
      selected: false,
      positionAbsolute: {
        x: 766.6435908098493,
        y: 409.9314708995975,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "SINE-f452cac7-d21e-4cf4-b27a-0de12f12876b",
      type: "SIMULATION",
      data: {
        id: "SINE-f452cac7-d21e-4cf4-b27a-0de12f12876b",
        label: "SINE",
        func: "SINE",
        type: "SIMULATION",
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
        x: 1215.215019381278,
        y: 221.36004232816884,
      },
      selected: false,
      positionAbsolute: {
        x: 1215.215019381278,
        y: 221.36004232816884,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acf",
      type: "SIMULATION",
      data: {
        id: "CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acf",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
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
        x: 1243.7864479527066,
        y: 644.2171851853118,
      },
      selected: false,
      positionAbsolute: {
        x: 1243.7864479527066,
        y: 644.2171851853118,
      },
      dragging: true,
    },
    {
      width: 130,
      height: 130,
      id: "RAND-95ba6665-cce5-457b-8a99-f3c1311dd86e",
      type: "SIMULATION",
      data: {
        id: "RAND-95ba6665-cce5-457b-8a99-f3c1311dd86e",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
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
        x: 1229.5007336669921,
        y: 447.0743280424546,
      },
      selected: false,
      positionAbsolute: {
        x: 1229.5007336669921,
        y: 447.0743280424546,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 130,
      id: "MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bc",
      type: "ARITHMETIC",
      data: {
        id: "MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bc",
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
        x: 1499.5007336669921,
        y: 267.0743280424545,
      },
      selected: false,
      positionAbsolute: {
        x: 1499.5007336669921,
        y: 267.0743280424545,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 130,
      id: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
      type: "ARITHMETIC",
      data: {
        id: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
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
        x: 1710.9293050955637,
        y: 429.93147089959757,
      },
      selected: false,
      positionAbsolute: {
        x: 1710.9293050955637,
        y: 429.93147089959757,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 167,
      id: "HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79",
      type: "PLOTLY_VISOR",
      data: {
        id: "HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79",
        label: "HISTOGRAM",
        func: "HISTOGRAM",
        type: "PLOTLY_VISOR",
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
        x: 1908.0721622384208,
        y: 245.64575661388324,
      },
      selected: false,
      positionAbsolute: {
        x: 1908.0721622384208,
        y: 245.64575661388324,
      },
      dragging: true,
    },
    {
      id: "SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700b",
      type: "PLOTLY_VISOR",
      data: {
        id: "SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700b",
        label: "SCATTER",
        func: "SCATTER",
        type: "PLOTLY_VISOR",
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
      },
      position: {
        x: 1968.0721622384208,
        y: 574.2171851853118,
      },
      width: 225,
      height: 234,
    },
    {
      width: 210,
      height: 130,
      id: "END-ba56512b-86df-4ff0-b411-70b0248cffd5",
      type: "TERMINATOR",
      data: {
        id: "END-ba56512b-86df-4ff0-b411-70b0248cffd5",
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
        x: 2315.2150193812777,
        y: 428.502899471026,
      },
      selected: false,
      positionAbsolute: {
        x: 2315.2150193812777,
        y: 428.502899471026,
      },
      dragging: true,
    },
  ],
  edges: [
    {
      source: "LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7c",
      sourceHandle: "default",
      target: "SINE-f452cac7-d21e-4cf4-b27a-0de12f12876b",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7cdefault-SINE-f452cac7-d21e-4cf4-b27a-0de12f12876bdefault",
    },
    {
      source: "LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7c",
      sourceHandle: "default",
      target: "RAND-95ba6665-cce5-457b-8a99-f3c1311dd86e",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7cdefault-RAND-95ba6665-cce5-457b-8a99-f3c1311dd86edefault",
    },
    {
      source: "LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7c",
      sourceHandle: "default",
      target: "CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acf",
      targetHandle: "default",
      id: "reactflow__edge-LINSPACE-c396f455-6260-4f11-8170-15b01dacaf7cdefault-CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acfdefault",
    },
    {
      source: "SINE-f452cac7-d21e-4cf4-b27a-0de12f12876b",
      sourceHandle: "default",
      target: "MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bc",
      targetHandle: "a",
      id: "reactflow__edge-SINE-f452cac7-d21e-4cf4-b27a-0de12f12876bdefault-MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bca",
    },
    {
      source: "RAND-95ba6665-cce5-457b-8a99-f3c1311dd86e",
      sourceHandle: "default",
      target: "MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bc",
      targetHandle: "b",
      id: "reactflow__edge-RAND-95ba6665-cce5-457b-8a99-f3c1311dd86edefault-MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bcb",
    },
    {
      source: "MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bc",
      sourceHandle: "default",
      target: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
      targetHandle: "a",
      id: "reactflow__edge-MULTIPLY-5f82cd21-0b47-4d68-8051-1209468882bcdefault-ADD-96cdc149-9438-498a-8a8e-921bfb74dd9aa",
    },
    {
      source: "CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acf",
      sourceHandle: "default",
      target: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
      targetHandle: "b",
      id: "reactflow__edge-CONSTANT-5b815b6e-e15f-466f-a546-41acc0482acfdefault-ADD-96cdc149-9438-498a-8a8e-921bfb74dd9ab",
    },
    {
      source: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
      sourceHandle: "default",
      target: "HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79",
      targetHandle: "default",
      id: "reactflow__edge-ADD-96cdc149-9438-498a-8a8e-921bfb74dd9adefault-HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79default",
    },
    {
      source: "ADD-96cdc149-9438-498a-8a8e-921bfb74dd9a",
      sourceHandle: "default",
      target: "SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700b",
      targetHandle: "default",
      id: "reactflow__edge-ADD-96cdc149-9438-498a-8a8e-921bfb74dd9adefault-SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700bdefault",
    },
    {
      source: "HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79",
      sourceHandle: "default",
      target: "END-ba56512b-86df-4ff0-b411-70b0248cffd5",
      targetHandle: "default",
      id: "reactflow__edge-HISTOGRAM-fbfea5a1-3cc9-43c0-a471-e04632ec0e79default-END-ba56512b-86df-4ff0-b411-70b0248cffd5default",
    },
    {
      source: "SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700b",
      sourceHandle: "default",
      target: "END-ba56512b-86df-4ff0-b411-70b0248cffd5",
      targetHandle: "default",
      id: "reactflow__edge-SCATTER-f86c7984-90e2-4a90-85eb-d240caf0700bdefault-END-ba56512b-86df-4ff0-b411-70b0248cffd5default",
    },
  ],
  viewport: {
    x: 190.88735584608924,
    y: 61.85431161220251,
    zoom: 0.803483941208492,
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
