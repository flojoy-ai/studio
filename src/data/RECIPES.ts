export const NOISY_SINE = {
  nodes: [
    {
      width: 150,
      height: 135,
      id: "LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135ce",
      type: "default",
      data: {
        id: "LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135ce",
        label: "LINSPACE",
        func: "LINSPACE",
        type: "SIMULATION",
        ctrls: {
          start: {
            functionName: "LINSPACE",
            param: "start",
            value: "10",
          },
          end: {
            functionName: "LINSPACE",
            param: "end",
            value: "0",
          },
          step: {
            functionName: "LINSPACE",
            param: "step",
            value: "1000",
          },
        },
      },
      position: {
        x: -232.8571428571429,
        y: 321.9999999999999,
      },
      selected: false,
      positionAbsolute: {
        x: -232.8571428571429,
        y: 321.9999999999999,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd",
      type: "SIMULATION",
      data: {
        id: "SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd",
        label: "SINE",
        func: "SINE",
        type: "SIMULATION",
        ctrls: {
          frequency: {
            functionName: "SINE",
            param: "frequency",
            value: "1",
          },
          offset: {
            functionName: "SINE",
            param: "offset",
            value: "0",
          },
          amplitude: {
            functionName: "SINE",
            param: "amplitude",
            value: "1",
          },
          phase: {
            functionName: "SINE",
            param: "phase",
            value: "0",
          },
          waveform: {
            functionName: "SINE",
            param: "waveform",
            value: "sine",
          },
        },
      },
      position: {
        x: 198.57142857142856,
        y: 114.71428571428572,
      },
      selected: false,
      positionAbsolute: {
        x: 198.57142857142856,
        y: 114.71428571428572,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "RAND-434f7314-f239-4e7d-a9c6-629529db1d82",
      type: "SIMULATION",
      data: {
        id: "RAND-434f7314-f239-4e7d-a9c6-629529db1d82",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 193.28571428571428,
        y: 329.57142857142867,
      },
      selected: false,
      positionAbsolute: {
        x: 193.28571428571428,
        y: 329.57142857142867,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6",
      type: "SIMULATION",
      data: {
        id: "CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
        ctrls: {
          constant: {
            functionName: "CONSTANT",
            param: "constant",
            value: "2.0",
          },
        },
      },
      position: {
        x: 197.85714285714286,
        y: 543.2857142857143,
      },
      selected: false,
      positionAbsolute: {
        x: 197.85714285714286,
        y: 543.2857142857143,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 115,
      id: "MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766",
      type: "ARITHMETIC",
      data: {
        id: "MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766",
        label: "MULTIPLY",
        func: "MULTIPLY",
        type: "ARITHMETIC",
        ctrls: {},
        inputs: [
          {
            name: "y",
            id: "multiply_y",
            type: "target",
          },
        ],
      },
      position: {
        x: 497.1428571428571,
        y: 161.71428571428567,
      },
      selected: false,
      positionAbsolute: {
        x: 497.1428571428571,
        y: 161.71428571428567,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 115,
      id: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
      type: "ARITHMETIC",
      data: {
        id: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
        label: "ADD",
        func: "ADD",
        type: "ARITHMETIC",
        ctrls: {},
        inputs: [
          {
            name: "y",
            id: "add_y",
            type: "target",
          },
        ],
      },
      position: {
        x: 721.1428571428571,
        y: 336.5714285714285,
      },
      selected: false,
      positionAbsolute: {
        x: 721.1428571428571,
        y: 336.5714285714285,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 159,
      id: "SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6",
      type: "PLOTLY_VISOR",
      data: {
        id: "SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6",
        label: "SCATTER",
        func: "SCATTER",
        type: "PLOTLY_VISOR",
        ctrls: {},
      },
      position: {
        x: 1045.5714285714287,
        y: 461.4285714285715,
      },
      selected: false,
      positionAbsolute: {
        x: 1045.5714285714287,
        y: 461.4285714285715,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 159,
      id: "HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f",
      type: "PLOTLY_VISOR",
      data: {
        id: "HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f",
        label: "HISTOGRAM",
        func: "HISTOGRAM",
        type: "PLOTLY_VISOR",
        ctrls: {},
      },
      position: {
        x: 1036.5714285714287,
        y: 91.57142857142856,
      },
      selected: true,
      positionAbsolute: {
        x: 1036.5714285714287,
        y: 91.57142857142856,
      },
      dragging: true,
    },
    {
      width: 150,
      height: 135,
      id: "END-06a4da40-a0ae-44ad-873b-9b65d096880a",
      type: "TERMINATOR",
      data: {
        id: "END-06a4da40-a0ae-44ad-873b-9b65d096880a",
        label: "END",
        func: "END",
        type: "TERMINATOR",
        ctrls: {},
      },
      position: {
        x: 1515.0000000000002,
        y: 309.7142857142858,
      },
      selected: false,
      positionAbsolute: {
        x: 1515.0000000000002,
        y: 309.7142857142858,
      },
      dragging: true,
    },
  ],
  edges: [
    {
      source: "LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135ce",
      sourceHandle: "main",
      target: "RAND-434f7314-f239-4e7d-a9c6-629529db1d82",
      targetHandle: "RAND",
      id: "reactflow__edge-LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135cemain-RAND-434f7314-f239-4e7d-a9c6-629529db1d82RAND",
    },
    {
      source: "LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135ce",
      sourceHandle: "main",
      target: "CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6",
      targetHandle: "CONSTANT",
      id: "reactflow__edge-LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135cemain-CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6CONSTANT",
    },
    {
      source: "LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135ce",
      sourceHandle: "main",
      target: "SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd",
      targetHandle: "SINE",
      id: "reactflow__edge-LINSPACE-340e6c5c-8e47-4a5e-95ed-dc627e9135cemain-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbdSINE",
    },
    {
      source: "RAND-434f7314-f239-4e7d-a9c6-629529db1d82",
      sourceHandle: "main",
      target: "MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766",
      targetHandle: "multiply_y",
      id: "reactflow__edge-RAND-434f7314-f239-4e7d-a9c6-629529db1d82main-MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766multiply_y",
    },
    {
      source: "SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbd",
      sourceHandle: "main",
      target: "MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766",
      targetHandle: "MULTIPLY",
      id: "reactflow__edge-SINE-2cd08316-0a0c-4c13-9b1d-382ba4d74cbdmain-MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766MULTIPLY",
    },
    {
      source: "CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6",
      sourceHandle: "main",
      target: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
      targetHandle: "add_y",
      id: "reactflow__edge-CONSTANT-f4066d40-8610-40ad-9caf-b3b5802675c6main-ADD-a586b5d7-4343-430d-89ce-3c2a3d156695add_y",
    },
    {
      source: "MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766",
      sourceHandle: "main",
      target: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
      targetHandle: "ADD",
      id: "reactflow__edge-MULTIPLY-fe70e746-04bc-4c27-990d-821eed943766main-ADD-a586b5d7-4343-430d-89ce-3c2a3d156695ADD",
    },
    {
      source: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
      sourceHandle: "main",
      target: "HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f",
      targetHandle: "HISTOGRAM",
      id: "reactflow__edge-ADD-a586b5d7-4343-430d-89ce-3c2a3d156695main-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51fHISTOGRAM",
    },
    {
      source: "ADD-a586b5d7-4343-430d-89ce-3c2a3d156695",
      sourceHandle: "main",
      target: "SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6",
      targetHandle: "SCATTER",
      id: "reactflow__edge-ADD-a586b5d7-4343-430d-89ce-3c2a3d156695main-SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6SCATTER",
    },
    {
      source: "SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6",
      sourceHandle: "main",
      target: "END-06a4da40-a0ae-44ad-873b-9b65d096880a",
      targetHandle: "END",
      id: "reactflow__edge-SCATTER-da4e4991-d9a4-4c71-95e6-56b13266ede6main-END-06a4da40-a0ae-44ad-873b-9b65d096880aEND",
    },
    {
      source: "HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51f",
      sourceHandle: "main",
      target: "END-06a4da40-a0ae-44ad-873b-9b65d096880a",
      targetHandle: "END",
      id: "reactflow__edge-HISTOGRAM-09639bfa-f3be-4fdd-94a6-32aa1580f51fmain-END-06a4da40-a0ae-44ad-873b-9b65d096880aEND",
    },
  ],
  viewport: {
    x: 100.78251993386277,
    y: 34.10874204470315,
    zoom: 1.015849582027344,
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
