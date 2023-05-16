import ReactModal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PlotlyComponent from "../../common/PlotlyComponent";
import {
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/styles";
import { NodeModalProps } from "../types/NodeModalProps";
import { makePlotlyData } from "@src/utils/format_plotly_data";

const useStyles = createStyles((theme) => {
  return {
    closeButton: {
      margin: 5,
      cursor: "pointer",
      position: "absolute",
      top: 0,
      right: 0,
      background: "transparent",
      zIndex: 99,
      "&:hover": {
        color: theme.colors.red[7],
      },
    },
  };
});

const NodeModal = ({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  modalStyles,
  nodeLabel,
  nodeType,
  nd,
  pythonString,
  defaultLayout,
  clickedElement,
}: NodeModalProps) => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const colorScheme = useMantineColorScheme().colorScheme;
  return (
    <ReactModal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel=""
    >
      <button
        onClick={closeModal}
        data-cy="ctrl-close-btn"
        className={classes.closeButton}
      >
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
              data={makePlotlyData(nd.result.default_fig.data, theme)}
              layout={
                "layout" in nd.result.default_fig
                  ? Object.assign({}, defaultLayout)
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
    </ReactModal>
  );
};

export default NodeModal;
