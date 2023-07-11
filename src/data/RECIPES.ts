export const NOISY_SINE = {
  "nodes": [
    {
      "width": 130,
      "height": 130,
      "id": "SINE-db665d87-c2af-4acd-916b-b97a815e69a7",
      "type": "SIMULATIONS",
      "data": {
        "id": "SINE-db665d87-c2af-4acd-916b-b97a815e69a7",
        "label": "SINE",
        "func": "SINE",
        "type": "SIMULATIONS",
        "ctrls": {
          "amplitude": {
            "type": "float",
            "default": 1,
            "functionName": "SINE",
            "param": "amplitude",
            "value": 1
          },
          "frequency": {
            "type": "float",
            "default": 1,
            "functionName": "SINE",
            "param": "frequency",
            "value": 1
          },
          "offset": {
            "type": "float",
            "default": 0,
            "functionName": "SINE",
            "param": "offset",
            "value": 0
          },
          "phase": {
            "type": "float",
            "default": 0,
            "functionName": "SINE",
            "param": "phase",
            "value": 0
          },
          "waveform": {
            "type": "select",
            "default": "sine",
            "options": [
              "sine",
              "square",
              "triangle",
              "sawtooth"
            ],
            "functionName": "SINE",
            "param": "waveform",
            "value": "sine"
          }
        },
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair",
            "multiple": false
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair"
          }
        ],
        "path": "PYTHON/nodes/GENERATORS/SIMULATIONS/SINE/SINE.py",
        "selected": false
      },
      "position": {
        "x": 776.7590765313249,
        "y": -33.14686027271438
      },
      "selected": false,
      "positionAbsolute": {
        "x": 776.7590765313249,
        "y": -33.14686027271438
      },
      "dragging": true
    },
    {
      "width": 150,
      "height": 150,
      "id": "LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
      "type": "default",
      "data": {
        "id": "LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
        "label": "LINSPACE",
        "func": "LINSPACE",
        "type": "default",
        "ctrls": {
          "start": {
            "type": "float",
            "default": 10,
            "functionName": "LINSPACE",
            "param": "start",
            "value": 10
          },
          "end": {
            "type": "float",
            "default": 0,
            "functionName": "LINSPACE",
            "param": "end",
            "value": 0
          },
          "step": {
            "type": "int",
            "default": 1000,
            "functionName": "LINSPACE",
            "param": "step",
            "value": 1000
          }
        },
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair"
          }
        ],
        "path": "PYTHON/nodes/GENERATORS/SIMULATIONS/LINSPACE/LINSPACE.py",
        "selected": false
      },
      "position": {
        "x": 415.6162193884677,
        "y": 171.138854013
      },
      "selected": false,
      "positionAbsolute": {
        "x": 415.6162193884677,
        "y": 171.138854013
      },
      "dragging": true
    },
    {
      "width": 130,
      "height": 130,
      "id": "CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3",
      "type": "SIMULATIONS",
      "data": {
        "id": "CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3",
        "label": "2.0",
        "func": "CONSTANT",
        "type": "SIMULATIONS",
        "ctrls": {
          "constant": {
            "type": "float",
            "default": 3,
            "functionName": "CONSTANT",
            "param": "constant",
            "value": "2.0"
          }
        },
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair",
            "multiple": false
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair"
          }
        ],
        "path": "PYTHON/nodes/GENERATORS/SIMULATIONS/CONSTANT/CONSTANT.py",
        "selected": false
      },
      "position": {
        "x": 777.034632942326,
        "y": 399.72607622902814
      },
      "selected": false,
      "positionAbsolute": {
        "x": 777.034632942326,
        "y": 399.72607622902814
      },
      "dragging": true
    },
    {
      "width": 210,
      "height": 130,
      "id": "END-aa17356b-c7af-408e-8c56-531a3fe595d1",
      "type": "TERMINATORS",
      "data": {
        "id": "END-aa17356b-c7af-408e-8c56-531a3fe595d1",
        "label": "END",
        "func": "END",
        "type": "TERMINATORS",
        "ctrls": {},
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "Any",
            "multiple": false
          }
        ],
        "path": "PYTHON/nodes/LOGIC_GATES/TERMINATORS/END/END.py",
        "selected": false
      },
      "position": {
        "x": 1740.0479664071067,
        "y": 178.93847492277808
      },
      "selected": false,
      "positionAbsolute": {
        "x": 1740.0479664071067,
        "y": 178.93847492277808
      },
      "dragging": true
    },
    {
      "width": 99,
      "height": 130,
      "id": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "type": "ARITHMETIC",
      "data": {
        "id": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
        "label": "ADD",
        "func": "ADD",
        "type": "ARITHMETIC",
        "ctrls": {},
        "inputs": [
          {
            "name": "a",
            "id": "a",
            "type": "OrderedPair",
            "multiple": false
          },
          {
            "name": "b",
            "id": "b",
            "type": "OrderedPair",
            "multiple": true
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair"
          }
        ],
        "path": "PYTHON/nodes/TRANSFORMERS/ARITHMETIC/ADD/ADD.py",
        "selected": false
      },
      "position": {
        "x": 1087.9891474596368,
        "y": 195.25915121516448
      },
      "selected": false,
      "positionAbsolute": {
        "x": 1087.9891474596368,
        "y": 195.25915121516448
      },
      "dragging": true
    },
    {
      "width": 380,
      "height": 293,
      "id": "HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82",
      "type": "PLOTLY",
      "data": {
        "id": "HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82",
        "label": "HISTOGRAM",
        "func": "HISTOGRAM",
        "type": "PLOTLY",
        "ctrls": {},
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair|DataFrame|Matrix",
            "multiple": false
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "Plotly"
          }
        ],
        "path": "PYTHON/nodes/VISUALIZERS/PLOTLY/HISTOGRAM/HISTOGRAM.py",
        "selected": false
      },
      "position": {
        "x": 1301.9835116897505,
        "y": -28.568299803888863
      },
      "selected": false,
      "positionAbsolute": {
        "x": 1301.9835116897505,
        "y": -28.568299803888863
      },
      "dragging": true
    },
    {
      "width": 380,
      "height": 293,
      "id": "SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507a",
      "type": "PLOTLY",
      "data": {
        "id": "SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507a",
        "label": "SCATTER",
        "func": "SCATTER",
        "type": "PLOTLY",
        "ctrls": {},
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair|DataFrame|Matrix",
            "multiple": false
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "Plotly"
          }
        ],
        "path": "PYTHON/nodes/VISUALIZERS/PLOTLY/SCATTER/SCATTER.py",
        "selected": false
      },
      "position": {
        "x": 1321.42749430047,
        "y": 335.8151686044447
      },
      "selected": false,
      "positionAbsolute": {
        "x": 1321.42749430047,
        "y": 335.8151686044447
      },
      "dragging": true
    },
    {
      "width": 130,
      "height": 130,
      "id": "RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691",
      "type": "SIMULATIONS",
      "data": {
        "id": "RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691",
        "label": "RAND",
        "func": "RAND",
        "type": "SIMULATIONS",
        "ctrls": {
          "distribution": {
            "type": "select",
            "default": "normal",
            "options": [
              "normal",
              "uniform",
              "poisson"
            ],
            "functionName": "RAND",
            "param": "distribution",
            "value": "uniform"
          },
          "lower_bound": {
            "type": "float",
            "default": 0,
            "functionName": "RAND",
            "param": "lower_bound",
            "value": 0
          },
          "upper_bound": {
            "type": "float",
            "default": 1,
            "functionName": "RAND",
            "param": "upper_bound",
            "value": "2"
          },
          "normal_mean": {
            "type": "float",
            "default": 0,
            "functionName": "RAND",
            "param": "normal_mean",
            "value": 0
          },
          "normal_standard_deviation": {
            "type": "float",
            "default": 1,
            "functionName": "RAND",
            "param": "normal_standard_deviation",
            "value": 1
          },
          "poisson_events": {
            "type": "float",
            "default": 1,
            "functionName": "RAND",
            "param": "poisson_events",
            "value": 1
          }
        },
        "inputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair",
            "multiple": false
          }
        ],
        "outputs": [
          {
            "name": "default",
            "id": "default",
            "type": "OrderedPair|Scalar"
          }
        ],
        "path": "PYTHON/nodes/GENERATORS/SIMULATIONS/RAND/RAND.py",
        "selected": true
      },
      "position": {
        "x": 782.1532025503109,
        "y": 182.1491545203296
      },
      "selected": true,
      "positionAbsolute": {
        "x": 782.1532025503109,
        "y": 182.1491545203296
      },
      "dragging": true
    }
  ],
  "edges": [
    {
      "source": "LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
      "sourceHandle": "default",
      "target": "SINE-db665d87-c2af-4acd-916b-b97a815e69a7",
      "targetHandle": "default",
      "id": "reactflow__edge-LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3default-SINE-db665d87-c2af-4acd-916b-b97a815e69a7default"
    },
    {
      "source": "LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
      "sourceHandle": "default",
      "target": "CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3",
      "targetHandle": "default",
      "id": "reactflow__edge-LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3default-CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3default"
    },
    {
      "source": "SINE-db665d87-c2af-4acd-916b-b97a815e69a7",
      "sourceHandle": "default",
      "target": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "targetHandle": "a",
      "id": "reactflow__edge-SINE-db665d87-c2af-4acd-916b-b97a815e69a7default-ADD-b4cb003b-f34d-419e-bc95-452ab539c1eca"
    },
    {
      "source": "CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3",
      "sourceHandle": "default",
      "target": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "targetHandle": "b",
      "id": "reactflow__edge-CONSTANT-a357c1d7-0a1e-459b-bc03-faa48026e0e3default-ADD-b4cb003b-f34d-419e-bc95-452ab539c1ecb"
    },
    {
      "source": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "sourceHandle": "default",
      "target": "SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507a",
      "targetHandle": "default",
      "id": "reactflow__edge-ADD-b4cb003b-f34d-419e-bc95-452ab539c1ecdefault-SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507adefault"
    },
    {
      "source": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "sourceHandle": "default",
      "target": "HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82",
      "targetHandle": "default",
      "id": "reactflow__edge-ADD-b4cb003b-f34d-419e-bc95-452ab539c1ecdefault-HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82default"
    },
    {
      "source": "HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82",
      "sourceHandle": "default",
      "target": "END-aa17356b-c7af-408e-8c56-531a3fe595d1",
      "targetHandle": "default",
      "id": "reactflow__edge-HISTOGRAM-d53932d3-1dce-4320-a135-906b046cbe82default-END-aa17356b-c7af-408e-8c56-531a3fe595d1default"
    },
    {
      "source": "SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507a",
      "sourceHandle": "default",
      "target": "END-aa17356b-c7af-408e-8c56-531a3fe595d1",
      "targetHandle": "default",
      "id": "reactflow__edge-SCATTER-8ac7a273-ef5f-4780-bc57-6c62c5ce507adefault-END-aa17356b-c7af-408e-8c56-531a3fe595d1default"
    },
    {
      "source": "LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
      "sourceHandle": "default",
      "target": "RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691",
      "targetHandle": "default",
      "id": "reactflow__edge-LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3default-RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691default"
    },
    {
      "source": "RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691",
      "sourceHandle": "default",
      "target": "ADD-b4cb003b-f34d-419e-bc95-452ab539c1ec",
      "targetHandle": "b",
      "id": "reactflow__edge-RAND-4eaa4dfb-6dd0-47f8-90da-21991c217691default-ADD-b4cb003b-f34d-419e-bc95-452ab539c1ecb"
    }
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
