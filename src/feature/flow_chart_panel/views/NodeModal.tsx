import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PlotlyComponent from "../../common/PlotlyComponent";
import { Modal } from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";
import { NodeModalProps } from "../types/NodeModalProps";
import { makePlotlyData } from "@src/utils/format_plotly_data";
import { IconBrandGithub, IconBrandGithubFilled } from "@tabler/icons-react";
import {CMND_TREE} from "../manifest/COMMANDS_MANIFEST"
import { forEach } from "cypress/types/lodash";


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
  const GLINK = 'https://github.com/flojoy-io/nodes/blob/main';
  let nodeCategory = "";
  let nodeTypeLink = "";
  const nodeDataLabel = pythonString.split('.')[0];
  const colorScheme = theme.colorScheme;

  CMND_TREE.child?.forEach(outer => {
    outer.child?.forEach(inner => {
      if (inner.key === nodeType) {
        nodeCategory = outer.title.toUpperCase();
        nodeTypeLink = inner.title.toUpperCase();
        nodeCategory = nodeCategory.replace(/\s/g, "_");
        nodeTypeLink = nodeTypeLink.replace(/\s/g, "_");
        if (nodeTypeLink === "CLOUD_DATABASES") nodeTypeLink = "CLOUD_DATABASE";
      }
    });
  })

  let LINK : string;
  if (nodeDataLabel === "END") {
    LINK = `${GLINK}/${nodeCategory}/${nodeTypeLink}/${pythonString}`;
  } else {
    LINK = `${GLINK}/${nodeCategory}/${nodeTypeLink}/${nodeDataLabel}/${pythonString}`;
  }


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

    <div style = {{display: "flex"}}>
      <h3>Python code</h3>
      <div style = {{marginLeft: 10, marginTop: 21, marginBottom:21}}>
        <a href={LINK} target="_blank"> 
        {colorScheme === "dark" ? <IconBrandGithub/> : <IconBrandGithubFilled/>}</a>
      </div>
    </div>

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
