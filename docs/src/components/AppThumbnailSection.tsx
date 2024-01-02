import React from "react";
import AppThumbnail from "./AppThumbnail";
import * as nodeData from "./../../nodeSidebar.json";

type AppThumbnailSectionProps = {
  children: string;
  sectionName: string;
  blockquote: string;
  sectionRoot: string;
  sectionSubRoot: string;
  displayPath: boolean;
  nodes: object;
};

export default function AppThumbnailSection({
  children,
  sectionName,
  blockquote,
  sectionRoot,
  sectionSubRoot,
  displayPath,
  nodes,
}: AppThumbnailSectionProps) {
  let nodePath: string;

  if (sectionSubRoot !== undefined) {
    // For example, 'I/O > Function Generators'
    // Use subSectionRoot to list automatically list all nodes from this root directory
    // rather than specifying them explictly in the nodes prop

    nodes = [];

    nodeData[sectionSubRoot].map((eachNode) => {
      // Example of eachNode:
      // "nodes/IO/INSTRUMENTS/FUNCTION_GENERATORS/KEYSIGHT/33XXX/ADVANCED/BURST_MODE_33510B/BURST_MODE_33510B",

      eachNode = eachNode.replace("nodes/" + sectionRoot + "/", "");
      eachNode = eachNode.split("/");
      eachNode.pop();
      eachNode = eachNode.join("/");
      nodes.push(eachNode);
    });
  }

  return (
    <div className="thumbnail-section">
      <h1>{sectionName}</h1>
      <blockquote>{blockquote}</blockquote>
      <p>
        {`Inspect the Python code for these ${sectionName} nodes `}
        <a href={`https://github.com/flojoy-ai/nodes/tree/main/${sectionRoot}`}>
          on GitHub
        </a>
        .
      </p>
      <div>
        {nodes.map((nodePath) => {
          return (
            <AppThumbnail
              key={nodePath}
              path={`${sectionRoot}/${nodePath}`}
              displayPath={displayPath}
            >
              {nodePath}
            </AppThumbnail>
          );
        })}
      </div>
    </div>
  );
}
