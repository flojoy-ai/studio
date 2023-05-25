import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PlotlyComponent from "../../common/PlotlyComponent";
import { Modal } from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";
import { NodeModalProps } from "../types/NodeModalProps";
import { makePlotlyData } from "@src/utils/format_plotly_data";

const NodeModal = ({
  modalIsOpen,
  closeModal,
  nodeLabel,
  nodeType,
  nd,
  pythonString,
  defaultLayout,
  clickedElement,
}: NodeModalProps) => {
  const theme = useMantineTheme();

  const colorScheme = theme.colorScheme;
  console.log(" nd: ", nd);
  return (
    <Modal
      data-testid="node-modal"
      opened={modalIsOpen}
      onClose={closeModal}
      size={1030}
      title={nodeLabel}
    >
      {nodeLabel !== undefined && nodeType !== undefined && (
        <h4>
          Function type: <code>{nodeType}</code>
        </h4>
      )}

      {!nd?.result ? (
        <p>
          <code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.
        </p>
      ) : (
        <div>
          {nd?.result && (
            <PlotlyComponent
              id={nd.id}
              data={makePlotlyData(nd.result.default_fig.data, theme)}
              layout={{
                ...nd.result.default_fig.layout,
                title: nd.result.default_fig.layout?.title || nodeLabel,
              }}
              useResizeHandler
              style={{
                height: 635,
                width: 630,
              }}
            />
          )}
        </div>
      )}

      <h3>Python code</h3>
      <SyntaxHighlighter
        language="python"
        style={colorScheme === "dark" ? srcery : docco}
      >
        {pythonString}
      </SyntaxHighlighter>

      <h3>Node data</h3>
      <SyntaxHighlighter
        language="json"
        style={colorScheme === "dark" ? srcery : docco}
      >
        {`${JSON.stringify(clickedElement, undefined, 4)}`}
      </SyntaxHighlighter>
    </Modal>
  );
};

export default NodeModal;

const data = {
  data: [
    {
      meta: {
        columnNames: {
          cells: {
            values: "A - B - C - D",
          },
        },
      },
      mode: "markers",
      type: "table",
      cells: {
        fill: {
          color: "rgb(255, 255, 255)",
        },
        font: {
          size: 10,
          color: "rgb(0, 0, 0)",
          family: "Overpass",
        },
        line: {
          color: "rgb(0, 0, 0)",
          width: 2,
        },
        meta: {
          columnNames: {
            values: "A - B - C - D",
          },
        },
        align: "center",
        height: 33,
        valuessrc: "jackp:18888:f2fba1,6a904e,27fb62,937cff*",
        // "values": [
        //   [
        //     "1.2e6",
        //     "342",
        //     "$\\vdots$",
        //     "-3.3e-9"
        //   ],
        //   [
        //     "4",
        //     "5",
        //     "$\\ddots$",
        //     "$\\ldots$"
        //   ],
        //   [
        //     "$\\ldots$",
        //     "$\\ddots$",
        //     "10",
        //     "11"
        //   ],
        //   [
        //     "12",
        //     "$\\vdots$",
        //     "14",
        //     "15"
        //   ]
        // ]
        values: [
          [4546556, 6, "$\\ddots", 30],
          [333521, 7, "$\\ddots", 31],
          ["$\\ddots", "$\\ddots", "$\\ddots", "$\\ddots"],
          [5, 11, "$\\ddots", 35],
        ],
      },
      header: {
        fill: {
          color: "rgb(255, 255, 255)",
        },
        font: {
          size: 12,
        },
        align: "left",
        values: "~:-100:~1000,~1001,~1002,~1003*",
      },
      hoverlabel: {
        align: "left",
      },
    },
  ],
  layout: {
    font: {
      family: "Courier New",
    },
    width: 150,
    xaxis: {
      range: [-1, 6],
      autorange: true,
    },
    yaxis: {
      range: [-1, 4],
      autorange: true,
    },
    height: 250,
    margin: {
      b: 0,
      l: 0,
      r: 0,
      t: 0,
      pad: 0,
    },
    modebar: {
      orientation: "v",
    },
    autosize: false,
    template: {
      data: {
        bar: [
          {
            type: "bar",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        table: [
          {
            type: "table",
            cells: {
              fill: {
                color: "#EBF0F8",
              },
              line: {
                color: "white",
              },
            },
            header: {
              fill: {
                color: "#C8D4E3",
              },
              line: {
                color: "white",
              },
            },
          },
        ],
        carpet: [
          {
            type: "carpet",
            aaxis: {
              gridcolor: "#C8D4E3",
              linecolor: "#C8D4E3",
              endlinecolor: "#2a3f5f",
              minorgridcolor: "#C8D4E3",
              startlinecolor: "#2a3f5f",
            },
            baxis: {
              gridcolor: "#C8D4E3",
              linecolor: "#C8D4E3",
              endlinecolor: "#2a3f5f",
              minorgridcolor: "#C8D4E3",
              startlinecolor: "#2a3f5f",
            },
          },
        ],
        mesh3d: [
          {
            type: "mesh3d",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
          },
        ],
        contour: [
          {
            type: "contour",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
            autocolorscale: true,
          },
        ],
        heatmap: [
          {
            type: "heatmap",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
            autocolorscale: true,
          },
        ],
        scatter: [
          {
            type: "scatter",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        surface: [
          {
            type: "surface",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
          },
        ],
        heatmapgl: [
          {
            type: "heatmapgl",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
          },
        ],
        histogram: [
          {
            type: "histogram",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        parcoords: [
          {
            line: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
            type: "parcoords",
          },
        ],
        scatter3d: [
          {
            type: "scatter3d",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        scattergl: [
          {
            type: "scattergl",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        choropleth: [
          {
            type: "choropleth",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
          },
        ],
        scattergeo: [
          {
            type: "scattergeo",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        histogram2d: [
          {
            type: "histogram2d",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
            autocolorscale: true,
          },
        ],
        scatterpolar: [
          {
            type: "scatterpolar",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        contourcarpet: [
          {
            type: "contourcarpet",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
          },
        ],
        scattercarpet: [
          {
            type: "scattercarpet",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        scattermapbox: [
          {
            type: "scattermapbox",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        scatterpolargl: [
          {
            type: "scatterpolargl",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        scatterternary: [
          {
            type: "scatterternary",
            marker: {
              colorbar: {
                ticks: "",
                outlinewidth: 0,
              },
            },
          },
        ],
        histogram2dcontour: [
          {
            type: "histogram2dcontour",
            colorbar: {
              ticks: "",
              outlinewidth: 0,
            },
            autocolorscale: true,
          },
        ],
      },
      layout: {
        geo: {
          bgcolor: "white",
          showland: true,
          lakecolor: "white",
          landcolor: "white",
          showlakes: true,
          subunitcolor: "#C8D4E3",
        },
        font: {
          color: "#2a3f5f",
        },
        polar: {
          bgcolor: "white",
          radialaxis: {
            ticks: "",
            gridcolor: "#EBF0F8",
            linecolor: "#EBF0F8",
          },
          angularaxis: {
            ticks: "",
            gridcolor: "#EBF0F8",
            linecolor: "#EBF0F8",
          },
        },
        scene: {
          xaxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            gridwidth: 2,
            linecolor: "#EBF0F8",
            zerolinecolor: "#EBF0F8",
            showbackground: true,
            backgroundcolor: "white",
          },
          yaxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            gridwidth: 2,
            linecolor: "#EBF0F8",
            zerolinecolor: "#EBF0F8",
            showbackground: true,
            backgroundcolor: "white",
          },
          zaxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            gridwidth: 2,
            linecolor: "#EBF0F8",
            zerolinecolor: "#EBF0F8",
            showbackground: true,
            backgroundcolor: "white",
          },
        },
        title: {
          x: 0.05,
        },
        xaxis: {
          ticks: "",
          gridcolor: "#EBF0F8",
          linecolor: "#EBF0F8",
          automargin: true,
          zerolinecolor: "#EBF0F8",
          zerolinewidth: 2,
        },
        yaxis: {
          ticks: "",
          gridcolor: "#EBF0F8",
          linecolor: "#EBF0F8",
          automargin: true,
          zerolinecolor: "#EBF0F8",
          zerolinewidth: 2,
        },
        ternary: {
          aaxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            linecolor: "#A2B1C6",
          },
          baxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            linecolor: "#A2B1C6",
          },
          caxis: {
            ticks: "",
            gridcolor: "#DFE8F3",
            linecolor: "#A2B1C6",
          },
          bgcolor: "white",
        },
        colorway: [
          "#636efa",
          "#EF553B",
          "#00cc96",
          "#ab63fa",
          "#19d3f3",
          "#e763fa",
          "#fecb52",
          "#ffa15a",
          "#ff6692",
          "#b6e880",
        ],
        hovermode: "closest",
        colorscale: {
          diverging: [
            [0, "#8e0152"],
            [0.1, "#c51b7d"],
            [0.2, "#de77ae"],
            [0.3, "#f1b6da"],
            [0.4, "#fde0ef"],
            [0.5, "#f7f7f7"],
            [0.6, "#e6f5d0"],
            [0.7, "#b8e186"],
            [0.8, "#7fbc41"],
            [0.9, "#4d9221"],
            [1, "#276419"],
          ],
          sequential: [
            [0, "#0508b8"],
            [0.0893854748603352, "#1910d8"],
            [0.1787709497206704, "#3c19f0"],
            [0.2681564245810056, "#6b1cfb"],
            [0.3575418994413408, "#981cfd"],
            [0.44692737430167595, "#bf1cfd"],
            [0.5363128491620112, "#dd2bfd"],
            [0.6256983240223464, "#f246fe"],
            [0.7150837988826816, "#fc67fd"],
            [0.8044692737430168, "#fe88fc"],
            [0.8938547486033519, "#fea5fd"],
            [0.9832402234636871, "#febefe"],
            [1, "#fec3fe"],
          ],
          sequentialminus: [
            [0, "#0508b8"],
            [0.0893854748603352, "#1910d8"],
            [0.1787709497206704, "#3c19f0"],
            [0.2681564245810056, "#6b1cfb"],
            [0.3575418994413408, "#981cfd"],
            [0.44692737430167595, "#bf1cfd"],
            [0.5363128491620112, "#dd2bfd"],
            [0.6256983240223464, "#f246fe"],
            [0.7150837988826816, "#fc67fd"],
            [0.8044692737430168, "#fe88fc"],
            [0.8938547486033519, "#fea5fd"],
            [0.9832402234636871, "#febefe"],
            [1, "#fec3fe"],
          ],
        },
        plot_bgcolor: "white",
        paper_bgcolor: "white",
        shapedefaults: {
          line: {
            width: 0,
          },
          opacity: 0.4,
          fillcolor: "#506784",
        },
        annotationdefaults: {
          arrowhead: 0,
          arrowcolor: "#506784",
          arrowwidth: 1,
        },
      },
      themeRef: "PLOTLY_WHITE",
    },
    hovermode: "x",
    hoverlabel: {
      font: {
        size: 13,
      },
    },
    uniformtext: {
      mode: "hide",
    },
  },
  frames: [],
};
