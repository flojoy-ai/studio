import ReactModal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PlotlyComponent from "../../common/PlotlyComponent";
import { NodeModalProps } from "../types/NodeModalProps";

function NodeModal({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  modalStyles,
  nodeLabel,
  nodeType,
  nd,
  pythonString,
  defaultLayout,
  theme,
  clickedElement,
}: NodeModalProps) {
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

      {!nd?.result ? (
        <p>
          <code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.
        </p>
      ) : (
        <div>
          {nd?.result && (
            <PlotlyComponent
              id={nd.id}
              data={nd.result.default_fig.data}
              layout={
                "layout" in nd.result.default_fig
                  ? Object.assign({}, nd.result.default_fig.layout)
                  : Object.assign({}, { title: `${nd.cmd}` }, defaultLayout)
              }
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
}

export default NodeModal;
