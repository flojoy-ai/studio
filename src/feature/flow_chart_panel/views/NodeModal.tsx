import SyntaxHighlighter from "react-syntax-highlighter";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import PlotlyComponent from "../../common/PlotlyComponent";
import { Flex, Box, Modal, createStyles, Button } from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";
import { NodeModalProps } from "../types/NodeModalProps";
import { makePlotlyData } from "@src/utils/format_plotly_data";
import { CMND_TREE, Sections } from "../manifest/COMMANDS_MANIFEST";
import { useFlojoySyntaxTheme } from "@src/assets/FlojoyTheme";

export const NodeModalStyles = createStyles((theme) => ({
  content: {
    borderRadius: 17,
    height: "700px",
  },
  header: {
    padding: "80px 0px 45px 86px",
    borderRadius: 17,
  },
  title: {
    position: "absolute",
    fontSize: 32,
    fontWeight: 700,
    color: `${theme.colors.title[0]}`,
  },
  body: {
    padding: "0px 65px",
  },
  close: {
    position: "absolute",
    iconSize: 50,
    svg: {
      width: 40,
      height: 40,
    },
    marginTop: 0,
    marginBottom: 90,
    marginLeft: 650,
  },
  buttonStyle1: {
    width: 180,
    fontSize: 14,
    borderRadius: 35,
    backgroundColor: `${theme.colors.accent1[0]}`,
    borderColor: `${theme.colors.accent1[0]}`,
    border: "1px solid",
    color: `${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
    }`,
    "&:hover": {
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.accent1[2]
          : theme.colors.accent1[1]
      }`,
      color: `${
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0]
      }`,
    },
  },
  buttonStyle2: {
    width: 180,
    fontSize: 14,
    borderRadius: 35,
    color: `${
      theme.colorScheme === "dark"
        ? theme.colors.accent1[0]
        : theme.colors.accent1[0]
    }`,
    borderColor: `${theme.colors.accent1[0]}`,
    backgroundColor: `${
      theme.colorScheme === "dark"
        ? theme.colors.accent4[1]
        : theme.colors.accent1[2]
    }`,
    border: "1px solid",
    "&:hover": {
      backgroundColor: `${
        theme.colorScheme === "dark"
          ? theme.colors.accent1[2]
          : theme.colors.accent1[1]
      }`,
      color: `${
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0]
      }`,
    },
  },
}));

const getPath = (obj: Sections, key: string, paths: string[] = []) => {
  if (obj.key! && obj.key!.includes(key)) {
    let searchKey = "";
    switch (obj.key) {
      case "PLOTLY_VISOR":
        searchKey = obj.title.toUpperCase();
        break;
      default:
        searchKey = obj.key;
    }
    return [searchKey];
  }
  if (obj.child !== null && obj.child.length > 0) {
    if (obj.parentKey!) {
      switch (obj.parentKey) {
        case "AI_ML":
          paths.push(obj.parentKey);
          break;
        default:
          paths.push(obj.parentKey + "S");
      }
    }

    let found = false;
    obj.child.forEach((childNode) => {
      const temPaths = getPath(childNode, key) as string[];
      if (temPaths) {
        paths = paths.concat(temPaths);
        found = true;
      }
    });

    !found && paths.pop();
    return paths;
  }

  return null;
};

// Import only the languages needed to reduce bundle size
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("json", json);

const NodeModal = ({
  modalIsOpen,
  closeModal,
  nodeLabel,
  nodeType,
  nd,
  nodeFileName,
  pythonString,
  clickedElement,
}: NodeModalProps) => {
  const theme = useMantineTheme();
  const { classes } = NodeModalStyles();
  const { darkFlojoy, lightFlojoy } = useFlojoySyntaxTheme();

  const GLINK = "https://github.com/flojoy-io/nodes/blob/main";
  let nodeCategory = "";
  const nodeDataLabel = nodeFileName.split(".")[0];
  const colorScheme = theme.colorScheme;
  
  let LINK = `${GLINK}`;
  if (getPath(CMND_TREE, nodeType) !== null) {
    const path: string[] = getPath(CMND_TREE, nodeType)!;
    nodeCategory = path[0];
    for (let i = 0; i < path.length; i++) {
      LINK += `/${path[i]}`;
    }
  }

  switch (nodeCategory) {
    case "GENERATORS":
      LINK = LINK + `S/${nodeDataLabel}/${nodeFileName}`;
      break;
    case "LOGIC_GATES":
      LINK = LINK + `S/${nodeFileName}`;
      break;
    default:
      LINK = LINK + `/${nodeDataLabel}/${nodeFileName}`;
  }
  
  return (
    <Modal
      data-testid="node-modal"
      opened={modalIsOpen}
      onClose={closeModal}
      size={800}
      title={nodeLabel}
      classNames={{
        content: classes.content,
        header: classes.header,
        title: classes.title,
        close: classes.close,
        body: classes.body,
      }}
    >
      <Flex gap="xl">
        <Box>
          <Button
            size="md"
            classNames={{ root: classes.buttonStyle1 }}
            component="a"
            href={LINK}
            target="_blank"
          >
            {/* <VectorIconSVG /> */}
            VIEW ON GITHUB
          </Button>
        </Box>
        <Box>
          <Button
            size="md"
            classNames={{ root: classes.buttonStyle2 }}
          >
            VIEW EXAMPLES
          </Button>
        </Box>
      </Flex>
      {nodeLabel !== undefined && nodeType !== undefined && (
        <h3
          style={{
            fontSize: 19,
            marginBottom: 5,
            lineHeight: 1.5,
            marginTop: 34,
            color: `${theme.colors.title[0]}`,
          }}
        >
          Function Type:{" "}
          <code style={{ color: `${theme.colors.accent1[0]}` }}>
            {nodeType}
          </code>
        </h3>
      )}
      {!nd?.result ? (
        <h3
          style={{
            fontSize: 19,
            fontWeight: 400,
            marginTop: 5,
            marginBottom: 15,
            color: `${theme.colors.text[0]}`,
          }}
        >
          <code>{nodeLabel}</code> not run yet - Click <i>Run Script</i>.
        </h3>
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
      <div style={{ display: "flex" }}>
        <h2 style={{ fontSize: 22, marginTop: 2, marginBottom: 0 }}>
          Python code
        </h2>
      </div>
      <SyntaxHighlighter
        language="python"
        style={colorScheme === "dark" ? darkFlojoy : lightFlojoy}
      >
        {pythonString}
      </SyntaxHighlighter>
      <h2 style={{ fontSize: 22, marginTop: 28, marginBottom: 0 }}>
        Node data
      </h2>
      <SyntaxHighlighter
        language="json"
        style={colorScheme === "dark" ? darkFlojoy : lightFlojoy}
      >
        {`${JSON.stringify(clickedElement, undefined, 4)}`}
      </SyntaxHighlighter>
    </Modal>
  );
};

export default NodeModal;
