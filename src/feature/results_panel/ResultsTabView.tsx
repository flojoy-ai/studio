import { useMemo } from "react";
import { useWindowSize } from "react-use";
import CustomEdge from "../flow_chart_panel/views/CustomEdge";
import { useResultsTabState } from "./ResultsTabState";
import CustomResultNode from "./views/CustomResultNode";

import { Layout } from "@src/feature/common/Layout";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useSocket } from "@src/hooks/useSocket";
import {
  ConnectionLineType,
  EdgeTypes,
  NodeTypes,
  OnInit,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";
import { useResultsTabEffects } from "./ResultsTabEffects";

const edgeTypes: EdgeTypes = { default: CustomEdge };
const nodeTypes: NodeTypes = { default: CustomResultNode };

const ResultsTab = () => {
  const {
    states: { programResults },
  } = useSocket();

  console.log(programResults);

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
    () => (programResults && programResults.io ? programResults.io : []),
    [programResults]
  );

  useResultsTabEffects({ nodeResults, setResultNodes, nodes, resultNodes });

  const proOptions = { hideAttribution: true };
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
            proOptions={proOptions}
          />
        </div>
      </ReactFlowProvider>
    </Layout>
  );
};

export default ResultsTab;
