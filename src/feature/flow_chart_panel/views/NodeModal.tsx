import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PlotlyComponent from "../../common/PlotlyComponent";
import { Modal, createStyles, Button } from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";
import { NodeModalProps } from "../types/NodeModalProps";
import { makePlotlyData } from "@src/utils/format_plotly_data";
import { IconBrandGithub, IconBrandGithubFilled } from "@tabler/icons-react";
import { CMND_TREE } from "../manifest/COMMANDS_MANIFEST";

export const NodeModalStyles = createStyles((theme) => ({
  content: {
    borderRadius: 17,
    width: 469,
    height: 672,
  },
  header: {
    padding: "40px 0px 32px 86px",
  },
  title: {
    width: 130,
    height: 27,
    position: "absolute",
    fontSize: 40,
    fontWeight: 700,
    color: `${theme.colors.title[0]}`,
  },
  body: {
    padding: "0px 50px",
  },
  close: {
    position: "absolute",
    svg: {
      width: 50,
      height: 50,
      viewBox: {
        width: 20,
        height: 20,
      },
    },
    marginTop: 5,
    marginBottom: 40,
    marginLeft: 900,
  },
  buttonStyle: {
    width: 150,
    marginRight: 11,
    borderRadius: 32,
    backgroundColor: `${theme.colors.accent1[0]}`,
    color: `${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
    }`,
    "&:hover": {
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.accent4[1]
          : theme.colors.accent1[2]
      }`,
      color: `${theme.colors.accent1[0]}`,
    },
  },
}));

const NodeModal = ({
  modalIsOpen,
  closeModal,
  nodeLabel,
  nodeType,
  nd,
  nodeFileName,
  pythonString,
  defaultLayout,
  clickedElement,
}: NodeModalProps) => {
  const theme = useMantineTheme();
  const { classes } = NodeModalStyles();

  const GLINK = "https://github.com/flojoy-io/nodes/blob/main";
  let nodeCategory = "";
  let nodeTypeLink = "";
  const nodeDataLabel = nodeFileName.split(".")[0];
  console.log("This is node label ", nodeLabel);
  console.log("This is node type: ", nodeType);
  console.log("This is node data function: ", clickedElement.data.func);
  const colorScheme = theme.colorScheme;

  CMND_TREE.child?.forEach((outer) => {
    outer.child?.forEach((inner) => {
      if (inner.key === nodeType) {
        nodeCategory = outer.title.toUpperCase();
        nodeTypeLink = inner.title.toUpperCase();
        nodeCategory = nodeCategory.replace(/\s/g, "_");
        nodeTypeLink = nodeTypeLink.replace(/\s/g, "_");
        if (nodeTypeLink === "CLOUD_DATABASES") nodeTypeLink = "CLOUD_DATABASE";
      }
    });
  });

  let LINK = "";
  switch (nodeDataLabel) {
    case "END":
      LINK = `${GLINK}/${nodeCategory}/${nodeTypeLink}/${nodeFileName}`;
      break;
    case "OBJECT_DETECTION":
      LINK = `${GLINK}/AI_ML/${nodeDataLabel}/${nodeFileName}`;
      break;
    default:
      LINK = `${GLINK}/${nodeCategory}/${nodeTypeLink}/${nodeDataLabel}/${nodeFileName}`;
  }

  return (
    <Modal
      data-testid="node-modal"
      opened={modalIsOpen}
      onClose={closeModal}
      size={1030}
      title={nodeLabel}
      classNames={{
        content: classes.content,
        header: classes.header,
        title: classes.title,
        close: classes.close,
        body: classes.body,
      }}
    >
      <div style={{ display: "flex" }}>
        <Button
          classNames={{ root: classes.buttonStyle }}
          component="a"
          href={LINK}
          target="_blank"
        >
          View On Github
        </Button>
        <Button classNames={{ root: classes.buttonStyle }}>
          View Examples
        </Button>
      </div>
      {nodeLabel !== undefined && nodeType !== undefined && (
        <h4 style={{ color: `${theme.colors.title[0]}` }}>
          Function type:{" "}
          <code style={{ color: `${theme.colors.accent1[0]}` }}>
            {nodeType}
          </code>
        </h4>
      )}
      {!nd?.result ? (
        <p style={{ color: `${theme.colors.text[0]}` }}>
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

      <div style={{ display: "flex" }}>
        <h2>Python code</h2>
      </div>
      <SyntaxHighlighter
        language="json"
        style={colorScheme === "dark" ? srcery : docco}
      >
        {pythonString}
      </SyntaxHighlighter>

      <h2>Node data</h2>
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
