import { useMemo } from "react";
import { useWindowSize } from "react-use";
import CustomEdge from "../flow_chart_panel/views/CustomEdge";
import CustomResultNode from "./views/CustomResultNode";
import { useResultsTabState } from "./ResultsTabState";

import {
  ConnectionLineType,
  EdgeTypes,
  NodeTypes,
  OnInit,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";
import { ResultsType } from "./types/ResultsType";
import { useResultsTabEffects } from "./ResultsTabEffects";
import { useSocket } from "@src/hooks/useSocket";
import { Layout } from "@src/Layout";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
interface ResultsTabProps {
  results: ResultsType;
}
const edgeTypes: EdgeTypes = { default: CustomEdge as any };
const nodeTypes: NodeTypes = { default: CustomResultNode as any };

const ResultsTab = () => {
  const { states } = useSocket();
  const { programResults } = states!;
  const results = programResults!;

  const { setResultNodes, resultNodes } = useResultsTabState();
  const { nodes, edges } = useFlowChartGraph();

  const { width: windowWidth } = useWindowSize();
  const onInit: OnInit = (rfIns) => {
    rfIns.fitView();

    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;

    rfIns.setViewport({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });
  };
  const nodeResults = useMemo(
    () => (results && "io" in results ? results.io! : []),
    [results]
  );

  useResultsTabEffects({ nodeResults, setResultNodes, nodes, resultNodes });

  return (
    <Layout>
      <ReactFlowProvider>
        <div
          style={{ height: "calc(100vh - 110px)" }}
          data-testid="results-flow"
        >
          <ReactFlow
            nodes={resultNodes}
            edges={edges}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.Step}
            onInit={onInit}
          />
        </div>
      </ReactFlowProvider>
    </Layout>
  );
};

export default ResultsTab;
