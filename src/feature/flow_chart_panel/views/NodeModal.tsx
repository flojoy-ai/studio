import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import { JSONTree } from "react-json-tree";
import { MantineTheme, useMantineTheme } from "@mantine/styles";
import { Node } from 'reactflow';
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlojoySyntaxTheme } from "@src/assets/FlojoyTheme";
import { NODES_REPO, DOCS_LINK } from "@src/data/constants";
import PlotlyComponent from "@src/components/plotly/PlotlyComponent";
import { makePlotlyData } from "@src/components/plotly/formatPlotlyData";
import MarkDownText from "@src/components/common/MarkDownText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@src/components/ui/dialog";
import { NodeResult } from "@src/feature/common/types/ResultsType";
import { ElementsData } from "@src/types/node";
import { ScrollArea } from "@src/components/ui/scroll-area";

// export const NodeModalStyles = createStyles((theme) => ({
//   content: {
//     borderRadius: 17,
//   },
//   header: {
//     padding: "65px 80px 30px 80px",
//     borderRadius: 17,
//     position: "unset",
//   },
//   title: {
//     display: "block",
//     position: "relative",
//     fontSize: 32,
//     fontWeight: 700,
//     color: `${theme.colors.title[0]}`,
//   },
//   body: {
//     padding: "10px 65px 45px",
//   },
//   close: {
//     position: "absolute",
//     iconSize: 50,
//     svg: {
//       width: 40,
//       height: 40,
//     },
//     right: 40,
//     top: 45,
//   },
//   buttonStyle1: {
//     width: 180,
//     fontSize: 14,
//     borderRadius: 35,
//     backgroundColor: `${theme.colors.accent1[0]}`,
//     borderColor: `${theme.colors.accent1[0]}`,
//     border: "1px solid",
//     color: `${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]
//       }`,
//     "&:hover": {
//       backgroundColor: `${theme.colorScheme === "dark"
//         ? theme.colors.accent1[2]
//         : theme.colors.accent1[1]
//         }`,
//       color: `${theme.colorScheme === "dark"
//         ? theme.colors.dark[7]
//         : theme.colors.gray[0]
//         }`,
//     },
//   },
//   buttonStyle2: {
//     width: 180,
//     fontSize: 14,
//     borderRadius: 35,
//     color: theme.colors.accent1[0],
//     borderColor: `${theme.colors.accent1[0]}`,
//     backgroundColor: `${theme.colorScheme === "dark"
//       ? theme.colors.accent4[1]
//       : theme.colors.accent1[2]
//       }`,
//     border: "1px solid",
//     "&:hover": {
//       backgroundColor: `${theme.colorScheme === "dark"
//         ? theme.colors.accent1[2]
//         : theme.colors.accent1[1]
//         }`,
//       color: `${theme.colorScheme === "dark"
//         ? theme.colors.dark[7]
//         : theme.colors.gray[0]
//         }`,
//     },
//   },
// }));

const themeJSONTree = (theme: MantineTheme) => {
  const darkJSONTree = {
    scheme: "flojoy",
    author: "Jack",
    base00: `${theme.colors.modal[0]}`,
    base01: `${theme.colors.accent3[0]}`,
    base02: `${theme.colors.accent3[0]}`,
    base03: `${theme.colors.accent2[0]}`,
    base04: `${theme.colors.accent1[1]}`,
    base05: `${theme.colors.accent3[0]}`,
    base06: `${theme.colors.accent2[0]}`,
    base07: `${theme.colors.accent2[0]}`,
    base08: `${theme.colors.accent3[0]}`,
    base09: `${theme.colors.accent1[0]}`,
    base0A: `${theme.colors.accent1[1]}`,
    base0B: `${theme.colors.accent3[0]}`,
    base0C: `${theme.colors.text[0]}`,
    base0D: `${theme.colors.title[0]}`,
    base0E: `${theme.colors.accent1[0]}`,
    base0F: `${theme.colors.accent1[0]}`,
  };

  const lightJSONTree = {
    scheme: "flojoy",
    author: "Jack",
    base00: `${theme.colors.modal[0]}`,
    base01: `${theme.colors.accent3[0]}`,
    base02: `${theme.colors.accent3[0]}`,
    base03: `${theme.colors.accent2[0]}`,
    base04: `${theme.colors.accent1[0]}`,
    base05: `${theme.colors.accent3[0]}`,
    base06: `${theme.colors.accent2[0]}`,
    base07: `${theme.colors.accent2[0]}`,
    base08: `${theme.colors.accent3[0]}`,
    base09: `${theme.colors.accent1[0]}`,
    base0A: `${theme.colors.accent1[1]}`,
    base0B: `${theme.colors.accent3[0]}`,
    base0C: `${theme.colors.text[0]}`,
    base0D: `${theme.colors.title[0]}`,
    base0E: `${theme.colors.accent1[0]}`,
    base0F: `${theme.colors.accent1[0]}`,
  };
  return { darkJSONTree, lightJSONTree };
};

// Import only the languages needed to reduce bundle size
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("json", json);

export type NodeModalProps = {
  modalIsOpen: boolean;
  setModalOpen: (open: boolean) => void;
  nd: NodeResult | null;
  pythonString: string;
  nodeFilePath: string;
  selectedNode: Node<ElementsData>;
};

const NodeModal = ({
  modalIsOpen,
  setModalOpen,
  nd,
  nodeFilePath,
  pythonString,
  selectedNode,
}: NodeModalProps) => {
  const theme = useMantineTheme();
  const { darkFlojoy, lightFlojoy } = useFlojoySyntaxTheme();
  const { lightJSONTree, darkJSONTree } = themeJSONTree(theme);
  const colorScheme = theme.colorScheme;

  // useKeyboardShortcut("ctrl", "e", closeModal);
  // useKeyboardShortcut("meta", "e", closeModal);

  const path = nodeFilePath.replace("\\", "/").replace("PYTHON/nodes/", "");

  const link = `${NODES_REPO}/${path}`;

  const docsLink = `${DOCS_LINK}/nodes/${path
    .split("/")
    .slice(0, -1)
    .join("/")}`;

  return (
    <Dialog
      data-testid="node-modal"
      open={modalIsOpen}
      onOpenChange={setModalOpen}
    >
      <DialogContent className="md:max-w-3xl bg-background border-muted overflow-y-scroll max-h-screen p-12 my-12">
        <DialogHeader>
          <DialogTitle className="text-3xl">{selectedNode?.data.func}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-x-4">
          <a className="border-accent1 border rounded-full text-accent1 px-6 py-2 uppercase font-semibold text-sm hover:bg-accent1/10 duration-200" href={link} target="_blank">View on GitHub</a>
          <a className="border-accent1 border rounded-full text-accent1 px-6 py-2 uppercase font-semibold text-sm hover:bg-accent1/10 duration-200" href={docsLink} target="_blank">View Examples</a>
        </div>
        <div className='py-1' />
        <h3 className="text-gray-800 dark:text-gray-200">
          Function Type: <code className="text-accent1">{selectedNode.data.type}</code>
        </h3>
        {!nd?.result ? (
          <h3 className='text-gray-600 dark:text-gray-400'>
            <code>{selectedNode.data.func}</code> not run yet - Click <i>Run Script</i>.
          </h3>
        ) : (
          <NodeModalDataViz nd={nd} theme={theme.colorScheme} selectedNode={selectedNode} />
        )}
        <div className='py-0.5' />
        <h2 className="text-lg font-semibold text-muted-foreground">
          Python code
        </h2>
        <ScrollArea className="h-full w-full rounded-lg" horizontal>
          <SyntaxHighlighter
            language="python"
            style={colorScheme === "dark" ? darkFlojoy : lightFlojoy}
          >
            {pythonString}
          </SyntaxHighlighter>
        </ScrollArea>
        <div className='py-2' />
        <h2 className="text-lg font-semibold text-muted-foreground">
          Node data
        </h2>
        <div className="rounded-md bg-modal px-4">
          <JSONTree
            data={selectedNode}
            theme={{
              extend: colorScheme === "dark" ? darkJSONTree : lightJSONTree,
            }}
            labelRenderer={([key]) => (
              <span style={{ paddingLeft: 8 }}>{key}</span>
            )}
          />
        </div>
        <div className='py-2' />
      </DialogContent>
    </Dialog>
  );
};

type NodeModalDataVizProps = {
  nd: NodeResult;
  selectedNode: Node<ElementsData>;
  theme: "light" | "dark";
}

const NodeModalDataViz = ({ nd, selectedNode, theme }: NodeModalDataVizProps) => {
  return (
    <div>
      {nd.result.text_blob && (
        <div className="h-[600px] overflow-auto whitespace-pre-wrap rounded-md bg-modal">
          <MarkDownText text={nd.result.text_blob} />
        </div>
      )}
      {nd.result.plotly_fig && (
        <div className="flex justify-center">
          <PlotlyComponent
            data={makePlotlyData(
              nd.result.plotly_fig.data,
              theme
            )}
            layout={{
              ...nd.result.plotly_fig.layout,
              title: nd.result.plotly_fig.layout?.title ?? selectedNode.data.func,
            }}
            useResizeHandler
            theme={theme}
          />
        </div>
      )}
    </div>
  )
}

export default NodeModal;
