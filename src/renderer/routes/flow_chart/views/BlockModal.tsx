import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import { JSONTree } from "react-json-tree";
import { Node } from "reactflow";
import { flojoySyntaxTheme } from "@/renderer/assets/FlojoyTheme";
import { STUDIO_REPO, DOCS_LINK } from "@/renderer/data/constants";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { NodeResult } from "@/renderer/routes/common/types/ResultsType";
import { ElementsData } from "@/renderer/types/node";
import { ScrollArea, ScrollBar } from "@/renderer/components/ui/scroll-area";
import { useTheme } from "@/renderer/providers/themeProvider";
import { Button } from "@/renderer/components/ui/button";
import useWithPermission from "@/renderer/hooks/useWithPermission";

const jsonTheme = {
  scheme: "flojoy",
  author: "Jack",
  base00: "rgb(var(--color-modal))",
  base01: "rgb(var(--color-accent3))",
  base02: "rgb(var(--color-accent3))",
  base03: "rgb(var(--color-accent2))",
  base04: "rgb(var(--color-accent1))",
  base05: "rgb(var(--color-accent3))",
  base06: "rgb(var(--color-accent2))",
  base07: "rgb(var(--color-accent2))",
  base08: "rgb(var(--color-accent3))",
  base09: "rgb(var(--color-accent1))",
  base0A: "rgb(var(--color-accent1))",
  base0B: "rgb(var(--color-accent3))",
  base0C: "rgb(var(--foreground))",
  base0D: "rgb(var(--foreground))",
  base0E: "rgb(var(--color-accent1))",
  base0F: "rgb(var(--color-accent1))",
};

// Import only the languages needed to reduce bundle size
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("json", json);

export type BlockModalProps = {
  modalIsOpen: boolean;
  setModalOpen: (open: boolean) => void;
  nd: NodeResult | null;
  pythonString: string;
  blockFilePath: string;
  blockFullPath: string;
  selectedNode: Node<ElementsData>;
};

const BlockModal = ({
  modalIsOpen,
  setModalOpen,
  nd,
  blockFilePath,
  blockFullPath,
  pythonString,
  selectedNode,
}: BlockModalProps) => {
  const { resolvedTheme } = useTheme();
  const { withPermissionCheck } = useWithPermission();

  const path = blockFilePath.replace(/"\\"/g, "/");

  const link =
    path.startsWith("/") || path.includes(":")
      ? null
      : `${STUDIO_REPO}/blocks/${path}`;

  const docsLink = `${DOCS_LINK}/blocks/${path
    .split("/")
    .slice(0, -1)
    .join("/")}`.toLowerCase();

  return (
    <Dialog open={modalIsOpen} onOpenChange={setModalOpen}>
      <DialogContent className="my-12 max-h-screen overflow-y-scroll border-muted bg-background p-12 sm:max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {selectedNode?.data.func}
          </DialogTitle>
        </DialogHeader>
        {link && (
          <div className="flex gap-x-4">
            <a
              className="rounded-full border border-accent1 px-6 py-2 text-sm font-semibold uppercase text-accent1 duration-200 hover:bg-accent1/10"
              href={link}
              target="_blank"
            >
              View on GitHub
            </a>
            <a
              className="rounded-full border border-accent1 px-6 py-2 text-sm font-semibold uppercase text-accent1 duration-200 hover:bg-accent1/10"
              href={docsLink}
              target="_blank"
            >
              View Examples
            </a>
          </div>
        )}
        <div className="py-1" />
        <h3 className="text-gray-800 dark:text-gray-200">
          Function Type:{" "}
          <code className="text-accent1">{selectedNode.data.type}</code>
        </h3>
        {nd?.result && (
          <NodeModalDataViz
            nd={nd}
            theme={resolvedTheme}
            selectedNode={selectedNode}
          />
        )}
        <div className="py-0.5" />
        <h2 className="text-lg font-semibold text-muted-foreground">
          Python code
        </h2>

        <div className="flex gap-2">
          <Button
            onClick={withPermissionCheck(
              async () => await window.api.openEditorWindow(blockFullPath),
            )}
            data-testid="btn-edit-python"
            variant="secondary"
          >
            Edit Python Code
          </Button>
          <Button
            onClick={withPermissionCheck(
              async () =>
                await window.api.openLink(`vscode://file/${blockFullPath}`),
            )}
            data-testid="btn-open-vscode"
            variant="secondary"
          >
            Open in VSCode
          </Button>
        </div>

        <ScrollArea className="h-full w-full rounded-lg">
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
          <SyntaxHighlighter language="python" style={flojoySyntaxTheme}>
            {pythonString}
          </SyntaxHighlighter>
        </ScrollArea>
        <div className="py-2" />
        <h2 className="text-lg font-semibold text-muted-foreground">
          Block data
        </h2>
        <div
          className="rounded-md bg-modal px-4"
          data-testid="block-info-json"
          data-blockjson={JSON.stringify(selectedNode)}
        >
          <JSONTree
            data={selectedNode}
            theme={{
              extend: jsonTheme,
            }}
            labelRenderer={([key]) => (
              <span style={{ paddingLeft: 8 }}>{key}</span>
            )}
          />
        </div>
        <div className="py-2" />
      </DialogContent>
    </Dialog>
  );
};

type NodeModalDataVizProps = {
  nd: NodeResult;
  selectedNode: Node<ElementsData>;
  theme: "light" | "dark";
};

const NodeModalDataViz = ({
  nd,
  selectedNode,
  theme,
}: NodeModalDataVizProps) => {
  return (
    <div>
      {nd.result.text_blob && (
        <div className="h-[600px] overflow-auto rounded-md bg-modal sm:max-w-xl md:max-w-4xl">
          <MarkDownText text={nd.result.text_blob} />
        </div>
      )}
      {nd.result.plotly_fig && (
        <div className="flex justify-center">
          <PlotlyComponent
            data={makePlotlyData(nd.result.plotly_fig.data, theme)}
            layout={{
              ...nd.result.plotly_fig.layout,
              title:
                nd.result.plotly_fig.layout?.title ?? selectedNode.data.func,
            }}
            useResizeHandler
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default BlockModal;
