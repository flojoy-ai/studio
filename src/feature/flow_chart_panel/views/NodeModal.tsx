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
console.log(" nd: ", nd)
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
                ... {
                  "autosize": false,
                  "height": 180,
                  "hovermode": "closest",
                  "margin": {
                      "b": 0,
                      "l": 0,
                      "r": 0,
                      "t": 0
                  },
                  "width": 200,
                  "xaxis": {
                      "visible": false
                  },
                  "yaxis": {
                      "visible": false
                  },
        
              }
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
