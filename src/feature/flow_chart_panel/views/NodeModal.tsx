import ReactModal from "react-modal";
import Plot from "react-plotly.js";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface Props {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalStyles: ReactModal.Styles;
  nodeLabel: any;
  nodeType: any;
  nd: any;
  dfltLayout: any;
  theme: "dark" | "light";
  clickedElement: any;
  pythonString: String;
}

const NodeModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  modalStyles,
  nodeLabel,
  nodeType,
  nd,
  pythonString,
  dfltLayout,
  theme,
  clickedElement,
}: Props) => {
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel=""
    >
      <button onClick={closeModal} className="ctrl-close-btn">
        x
      </button>

      {nodeLabel !== undefined && nodeType !== undefined && (
        <div>
          <h1>{nodeLabel}</h1>
          <h4>
            Function type: <code>{nodeType}</code>
          </h4>
        </div>
      )}

      {Object.keys(nd).length === 0 || !nd.result ? (
        <p>
          <code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.
        </p>
      ) : (
        <div>
          {nd?.result && (
            <Plot
              data={
                "data" in nd?.result
                  ? nd.result.data
                  : [{ x: nd.result["x0"], y: nd.result["y0"] }]
              }
              layout={
                "layout" in nd.result
                  ? Object.assign({}, nd.result.layout, dfltLayout)
                  : Object.assign({}, { title: `${nd.cmd}` }, dfltLayout)
              }
              useResizeHandler
            />
          )}
        </div>
      )}

      <h3>Python code</h3>
      <SyntaxHighlighter
        language="python"
        style={theme === "dark" ? srcery : docco}
      >
        {pythonString}
      </SyntaxHighlighter>

      <h3>Node data</h3>
      <SyntaxHighlighter
        language="json"
        style={theme === "dark" ? srcery : docco}
      >
        {`${JSON.stringify(clickedElement, undefined, 4)}`}
      </SyntaxHighlighter>
    </ReactModal>
  );
};

export default NodeModal;
