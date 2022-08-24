export const NOISY_SINE = {
    "elements": [{
        "id": "SINE-userGeneratedNode_1646417316016",
        "data": {
            "label": "SINE",
          	"type": "GENERATOR",
            "ctrls": {},
        },
        "position": {
            // "x": 177.55396300324264,
            x: 315,
            // "y": 84.6734922467507,
            y:55
        },
        "type": "default"
    }, {
        "id": "MULTIPLY-userGeneratedNode_1646417352715",
        "data": {
            "label": "MULTIPLY",
          	"type": "TRANSFORMER"
            ,"ctrls":{},
        },
        "position": {
            // "x": 319.16555425993334,
            // "y": 115.76932525364177
            "x": 532,
            "y": 100
        },
        "type": "default"
    }, {
        "id": "RAND-userGeneratedNode_1646417371398",
        "data": {
            "label": "RAND",
          	"type": "GENERATOR"
            ,"ctrls":{},
        },
        "position": {
            // "x": 176.78207972197464,
            // "y": 144.80185344693288
            "x": 315,
            "y": 212
        },
        "type": "default"
    }, {
        "id": "ADD-userGeneratedNode_1646417428589",
        "data": {
            "label": "ADD",
          	"type": "TRANSFORMER"
            ,"ctrls":{},
        },
        "position": {
            // "x": 466.25999796171885,
            // "y": 163.1823153721549
            "x": 782,
            "y": 210
        },
        "type": "default"
    }, {
        "id": "SCATTER-userGeneratedNode_1646417560399",
        "data": {
            "label": "SCATTER",
          	"type": "VISOR"
            ,"ctrls":{},
        },
        "position": {
            // "x": 616.0457824509575,
            // "y": 128.13874851945644
            "x": 1002,
            "y": 55
        },
        "type": "default"
    }, {
        "id": "HISTOGRAM-userGeneratedNode_1646417604301",
        "data": {
            "label": "HISTOGRAM",
          	"type": "VISOR"
            ,"ctrls":{},
        },
        "position": {
            // "x": 616.0536465173421,
            // "y": 194.2288925878753
            "x": 1002,
            "y": 369
        },
        "type": "default"
    }, {
        "id": "LINSPACE-userGeneratedNode_1646432683694",
        "data": {
            "label": "LINSPACE",
          	"type": "GENERATOR"
            ,"ctrls":{},
        },
        "position": {
            "x": 22.58283226103687,
            // "y": 144.88054916558963
            "y": 217
        },
        "type": "default"
    }, {
        "id": "2.0-userGeneratedNode_1646435677928",
        "data": {
            "label": "2.0",
          	"type": "GENERATOR"
            ,"ctrls":{},
        },
        "position": {
            // "x": 178.50497286105076,
            // "y": 206.64209529671734
            "x": 315,
            "y": 369
        },
        "type": "default"
    }, {
        "source": "SINE-userGeneratedNode_1646417316016",
        "sourceHandle": null,
        "target": "MULTIPLY-userGeneratedNode_1646417352715",
        "targetHandle": null,
        "id": "reactflow__edge-SINE-userGeneratedNode_1646417316016null-MULTIPLY-userGeneratedNode_1646417352715null",
        "type": "default"
    }, {
        "source": "RAND-userGeneratedNode_1646417371398",
        "sourceHandle": null,
        "target": "MULTIPLY-userGeneratedNode_1646417352715",
        "targetHandle": null,
        "id": "reactflow__edge-RAND-userGeneratedNode_1646417371398null-MULTIPLY-userGeneratedNode_1646417352715null",
        "type": "default"
    }, {
        "source": "MULTIPLY-userGeneratedNode_1646417352715",
        "sourceHandle": null,
        "target": "ADD-userGeneratedNode_1646417428589",
        "targetHandle": null,
        "id": "reactflow__edge-MULTIPLY-userGeneratedNode_1646417352715null-ADD-userGeneratedNode_1646417428589null",
        "type": "default"
    }, {
        "source": "ADD-userGeneratedNode_1646417428589",
        "sourceHandle": null,
        "target": "SCATTER-userGeneratedNode_1646417560399",
        "targetHandle": null,
        "id": "reactflow__edge-ADD-userGeneratedNode_1646417428589null-SCATTER-userGeneratedNode_1646417560399null",
        "type": "default"
    }, {
        "source": "ADD-userGeneratedNode_1646417428589",
        "sourceHandle": null,
        "target": "HISTOGRAM-userGeneratedNode_1646417604301",
        "targetHandle": null,
        "id": "reactflow__edge-ADD-userGeneratedNode_1646417428589null-HISTOGRAM-userGeneratedNode_1646417604301null",
        "type": "default"
    }, {
        "source": "LINSPACE-userGeneratedNode_1646432683694",
        "sourceHandle": null,
        "target": "SINE-userGeneratedNode_1646417316016",
        "targetHandle": null,
        "id": "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-SINE-userGeneratedNode_1646417316016null",
        "type": "default"
    }, {
        "source": "LINSPACE-userGeneratedNode_1646432683694",
        "sourceHandle": null,
        "target": "RAND-userGeneratedNode_1646417371398",
        "targetHandle": null,
        "id": "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-RAND-userGeneratedNode_1646417371398null",
        "type": "default"
    }, {
        "source": "2.0-userGeneratedNode_1646435677928",
        "sourceHandle": null,
        "target": "ADD-userGeneratedNode_1646417428589",
        "targetHandle": null,
        "id": "reactflow__edge-2.0-userGeneratedNode_1646435677928null-ADD-userGeneratedNode_1646417428589null",
        "type": "default"
    }, {
        "source": "LINSPACE-userGeneratedNode_1646432683694",
        "sourceHandle": null,
        "target": "2.0-userGeneratedNode_1646435677928",
        "targetHandle": null,
        "id": "reactflow__edge-LINSPACE-userGeneratedNode_1646432683694null-2.0-userGeneratedNode_1646435677928null",
        "type": "default"
    }],
    "position": [0, 0],
    "zoom": 1
}