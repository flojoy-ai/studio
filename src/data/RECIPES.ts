export const NOISY_SINE = {
  nodes: [
    {
      width: 150,
      height: 135,
      id: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      type: "default",
      data: {
        id: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
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
      position: {
        x: -13.97018918355137,
        y: 329.3798744949378,
      },
      selected: false,
      positionAbsolute: {
        x: -13.97018918355137,
        y: 329.3798744949378,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071",
      type: "SIMULATION",
      data: {
        id: "SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071",
        label: "SINE",
        func: "SINE",
        type: "SIMULATION",
        ctrls: {
          SINE_SINE_frequency: {
            functionName: "SINE",
            param: "frequency",
            value: 1,
          },
          SINE_SINE_offset: {
            functionName: "SINE",
            param: "offset",
            value: 0,
          },
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
      position: {
        x: 371.3390740788672,
        y: 98.25936438452473,
      },
      selected: false,
      positionAbsolute: {
        x: 371.3390740788672,
        y: 98.25936438452473,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71",
      type: "SIMULATION",
      data: {
        id: "RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71",
        label: "RAND",
        func: "RAND",
        type: "SIMULATION",
        ctrls: {},
      },
      position: {
        x: 370.2054732681884,
        y: 333.3052378946138,
      },
      selected: false,
      positionAbsolute: {
        x: 370.2054732681884,
        y: 333.3052378946138,
      },
      dragging: true,
    },
    {
      width: 115,
      height: 115,
      id: "CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413f",
      type: "SIMULATION",
      data: {
        id: "CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413f",
        label: "2.0",
        func: "CONSTANT",
        type: "SIMULATION",
        ctrls: {
          "CONSTANT_2.0_constant": {
            functionName: "CONSTANT",
            param: "constant",
            value: 2,
          },
        },
      },
      position: {
        x: 360.7021391443721,
        y: 561.2475408015774,
      },
      selected: false,
      positionAbsolute: {
        x: 360.7021391443721,
        y: 561.2475408015774,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 115,
      id: "MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2",
      type: "ARITHMETIC",
      data: {
        id: "MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2",
        label: "X",
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
        x: 644.2196760701734,
        y: 194.90429392401762,
      },
      selected: false,
      positionAbsolute: {
        x: 644.2196760701734,
        y: 194.90429392401762,
      },
      dragging: true,
    },
    {
      width: 99,
      height: 115,
      id: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
      type: "ARITHMETIC",
      data: {
        id: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
        label: "+",
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
        x: 842.4967707292867,
        y: 356.6784397726623,
      },
      selected: false,
      positionAbsolute: {
        x: 842.4967707292867,
        y: 356.6784397726623,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 159,
      id: "HISTOGRAM-64d7baa1-fe3a-4dd8-83bd-a6612fe96965",
      type: "VISOR",
      data: {
        id: "HISTOGRAM-64d7baa1-fe3a-4dd8-83bd-a6612fe96965",
        label: "HISTOGRAM",
        func: "HISTOGRAM",
        type: "VISOR",
        ctrls: {},
      },
      position: {
        x: 1104.8609541509745,
        y: 125.69279746964207,
      },
      selected: false,
      positionAbsolute: {
        x: 1104.8609541509745,
        y: 125.69279746964207,
      },
      dragging: true,
    },
    {
      width: 250,
      height: 159,
      id: "SCATTER-42385345-8d75-4260-88c5-0ea3ea72670f",
      type: "VISOR",
      data: {
        id: "SCATTER-42385345-8d75-4260-88c5-0ea3ea72670f",
        label: "SCATTER",
        func: "SCATTER",
        type: "VISOR",
        ctrls: {},
      },
      position: {
        x: 1121.1838695461784,
        y: 496.85976596421335,
      },
      selected: true,
      positionAbsolute: {
        x: 1121.1838695461784,
        y: 496.85976596421335,
      },
      dragging: true,
    },
  ],
  edges: [
    {
      source: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      sourceHandle: "main",
      target: "SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071",
      targetHandle: "SINE",
      id: "reactflow__edge-LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8amain-SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071SINE",
    },
    {
      source: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      sourceHandle: "main",
      target: "RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71",
      targetHandle: "RAND",
      id: "reactflow__edge-LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8amain-RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71RAND",
    },
    {
      source: "LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8a",
      sourceHandle: "main",
      target: "CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413f",
      targetHandle: "CONSTANT",
      id: "reactflow__edge-LINSPACE-a41853d0-3c5c-4742-b850-e9df4bc77a8amain-CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413fCONSTANT",
    },
    {
      source: "RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71",
      sourceHandle: "main",
      target: "MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2",
      targetHandle: "multiply_y",
      id: "reactflow__edge-RAND-4c462ed8-ad5c-453b-a194-3cfcb70d4c71main-MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2multiply_y",
    },
    {
      source: "SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071",
      sourceHandle: "main",
      target: "MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2",
      targetHandle: "MULTIPLY",
      id: "reactflow__edge-SINE-01fd90c6-f1b8-4e15-8bba-bb061f88e071main-MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2MULTIPLY",
    },
    {
      source: "CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413f",
      sourceHandle: "main",
      target: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
      targetHandle: "add_y",
      id: "reactflow__edge-CONSTANT-56cf2a89-5e0b-4d24-8ce1-7cf1f2b6413fmain-ADD-498040ea-e438-43c9-91eb-469170b77f84add_y",
    },
    {
      source: "MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2",
      sourceHandle: "main",
      target: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
      targetHandle: "ADD",
      id: "reactflow__edge-MULTIPLY-2a3b3354-90e3-4bc0-b61d-ed9b225a96a2main-ADD-498040ea-e438-43c9-91eb-469170b77f84ADD",
    },
    {
      source: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
      sourceHandle: "main",
      target: "HISTOGRAM-64d7baa1-fe3a-4dd8-83bd-a6612fe96965",
      targetHandle: "HISTOGRAM",
      id: "reactflow__edge-ADD-498040ea-e438-43c9-91eb-469170b77f84main-HISTOGRAM-64d7baa1-fe3a-4dd8-83bd-a6612fe96965HISTOGRAM",
    },
    {
      source: "ADD-498040ea-e438-43c9-91eb-469170b77f84",
      sourceHandle: "main",
      target: "SCATTER-42385345-8d75-4260-88c5-0ea3ea72670f",
      targetHandle: "SCATTER",
      id: "reactflow__edge-ADD-498040ea-e438-43c9-91eb-469170b77f84main-SCATTER-42385345-8d75-4260-88c5-0ea3ea72670fSCATTER",
    },
  ],
  viewport: {
    x: 434.72943722943717,
    y: 85.74675324675326,
    zoom: 0.8225108225108225,
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

export const OBJECT_DETECTION = {
  elements: [
      {
          id: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
          type: "default",
          position: {
            "x": 1136.6444964153716,
            "y": 132.0527524900669
          },
          data: {
              id: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
              label: "Object Detection",
              func: "OBJECT_DETECTION",
              type: "SIMULATION",
              ctrls: {}
          }
      },
      {
          id: "LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68c",
          type: "default",
          position: {
            "x": 228.09710889449232,
            "y": 129.01818849474336
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
                      value: "image"
                  },
                  LOCAL_FILE_file_op_type: {
                      functionName: "LOCAL_FILE",
                      param: "op_type",
                      value: "OD"
                  },
                  LOCAL_FILE_file_path: {
                      functionName: "LOCAL_FILE",
                      param: "path",
                      value: ""
                  }
              }
          }
      },
      {
          source: "LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68c",
          sourceHandle: "main",
          target: "OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1ad",
          targetHandle: "OBJECT_DETECTION",
          id: "reactflow__edge-LOCAL_FILE-731a1e1b-446e-4780-92bb-fb46d538b68cmain-OBJECT_DETECTION-de29f22f-0a28-4341-8720-c46f69deb1adOBJECT_DETECTION"
      }
  ],
  position: [
      0,
      0
  ],
  zoom: 1
}

export const EMPTY_CANVAS = {
  elements: [],
  position: [0, 0],
  zoom: 0.8,
};
