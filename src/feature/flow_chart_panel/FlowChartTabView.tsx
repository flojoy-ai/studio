import { useCallback, useEffect, useMemo, useState } from "react";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  ConnectionLineType,
  OnNodesChange,
  applyNodeChanges,
  applyEdgeChanges,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  OnInit,
  NodeMouseHandler,
  NodeDragHandler,
  OnNodesDelete,
  OnSelectionChangeFunc,
} from "reactflow";

import localforage from "localforage";

import usePlotLayout from "../common/usePlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import NodeModal from "./views/NodeModal";
import { FlowChartProps } from "./types/FlowChartProps";
import { useFlowChartTabState } from "./FlowChartTabState";
import { useFlowChartTabEffects } from "./FlowChartTabEffects";
import { nodeConfigs } from "@src/configs/NodeConfigs";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";
import { BezierEdge } from "reactflow";
import { NodeEditMenu } from "@src/feature/flow_chart_panel/components/node-edit-menu/NodeEditMenu";
import { useMantineColorScheme, useMantineTheme } from "@mantine/styles";
import { Node } from "reactflow";
import { useSocket } from "@src/hooks/useSocket";
import { Layout } from "@src/Layout";
import { useFlowChartGraph } from "@src/hooks/useFlowChartNodes";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./SideBar/Sidebar";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const FlowChartTab = () => {
  const [searchParams, _] = useSearchParams();
  const [clickedElement, setClickedElement] = useState<Node | undefined>(
    undefined
  );
  const { states } = useSocket();
  const { programResults } = states!;
  const results = programResults!;

  const {
    windowWidth,
    modalIsOpen,
    openModal,
    afterOpenModal,
    closeModal,
    nd,
    nodeLabel,
    nodeType,
    pythonString,
    setPythonString,
    defaultPythonFnLabel,
    defaultPythonFnType,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
  } = useFlowChartTabState();

  const { setRfInstance, setCtrlsManifest } = useFlowChartState();

  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedNode,
    loadFlowExportObject,
  } = useFlowChartGraph();

  const theme = useMantineTheme();

  // TODO: Add smart edge back?
  const edgeTypes: EdgeTypes = useMemo(() => ({ default: BezierEdge }), []);
  const nodeTypes: NodeTypes = useMemo(() => nodeConfigs, []);

  const modalStyles = {
    overlay: { zIndex: 99, backgroundColor: theme.colors.modal[0] + "7f" },
    content: { zIndex: 100, backgroundColor: theme.colors.modal[0] },
  };

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeLabel + ".py"]
    );
    setClickedElement(node);
    openModal();
  };

  const defaultLayout = usePlotLayout();

  const onInit: OnInit = (rfIns) => {
    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    rfIns.fitView();

    rfIns.setViewport({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });

    setRfInstance(rfIns.toObject());
  };
  const handleNodeDrag: NodeDragHandler = (_, node) => {
    setNodes((nodes) => {
      const nodeIndex = nodes.findIndex((el) => el.id === node.id);
      nodes[nodeIndex] = node;
    });
  };
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((ns) => applyNodeChanges(changes, ns));
    },
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const handleNodesDelete: OnNodesDelete = useCallback(
    (nodes) => {
      const selectedNodeIds = nodes.map((node) => node.id);
      setNodes((prev) =>
        prev.filter((node) => !selectedNodeIds.includes(node.id))
      );
    },
    [setNodes]
  );

  const fetchExampleApp = useCallback(
    async (fileName: string) => {
      const res = await fetch(`/example-apps/${fileName}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setCtrlsManifest(data.ctrlsManifest);
      const flow = data.rfInstance;
      loadFlowExportObject(flow);
    },
    [loadFlowExportObject, setCtrlsManifest]
  );

  useEffect(() => {
    const filename = searchParams.get("test_example_app");
    if (filename) {
      fetchExampleApp(filename);
    }
  }, []);

  useFlowChartTabEffects({
    clickedElement,
    results,
    afterOpenModal,
    closeModal,
    defaultPythonFnLabel,
    defaultPythonFnType,
    modalIsOpen,
    nd,
    nodeLabel,
    nodeType,
    openModal,
    pythonString,
    setIsModalOpen,
    setNd,
    setNodeLabel,
    setNodeType,
    setPythonString,
    windowWidth,
  });

  return (
    <Layout>
      <Sidebar setNodes={setNodes} />
      <ReactFlowProvider>
        <div
          style={{ height: "calc(100vh - 110px)" }}
          data-testid="react-flow"
          data-rfinstance={JSON.stringify(nodes)}
        >
          <NodeEditMenu selectedNode={selectedNode} />

          <ReactFlow
            style={{
              position: "fixed",
              height: "100%",
              width: "50%",
            }}
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            edgeTypes={edgeTypes}
            connectionLineType={ConnectionLineType.Step}
            onInit={onInit}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeClick}
            onNodeDragStop={handleNodeDrag}
            onNodesDelete={handleNodesDelete}
          />
        </div>

        <NodeModal
          afterOpenModal={afterOpenModal}
          clickedElement={clickedElement}
          closeModal={closeModal}
          defaultLayout={defaultLayout}
          modalIsOpen={modalIsOpen}
          modalStyles={modalStyles}
          nd={nd!}
          nodeLabel={nodeLabel}
          nodeType={nodeType}
          pythonString={pythonString}
        />
      </ReactFlowProvider>
    </Layout>
  );
};
export default FlowChartTab;
