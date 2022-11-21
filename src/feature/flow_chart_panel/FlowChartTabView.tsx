import { useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  Elements,
  EdgeTypesType,
  NodeTypesType,
  Connection,
  ConnectionLineType,
  Edge,
  OnLoadParams,
  OnLoadFunc,
} from "react-flow-renderer";

import localforage from "localforage";

import CustomEdge from "./views/CustomEdge";
import CustomNode from "./views/CustomNode";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";
import styledPlotLayout from "../common/defaultPlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import NodeModal from "./views/NodeModal";
import { FlowChartProps } from "./types/FlowChartProps";
import { useFlowChartTabState } from "./FlowChartTabState";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomNode as any };

const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE";

const FlowChartTab = ({
  results,
  theme,
  rfInstance,
  setRfInstance,
  elements,
  setElements,
  clickedElement,
  setClickedElement,
}: FlowChartProps) => {
  const {
    windowWidth,
    modalIsOpen,
    openModal,
    afterOpenModal,
    closeModal,
  } = useFlowChartTabState();

  const modalStyles = {
    overlay: { zIndex: 99 },
    content: { zIndex: 100 },
  };

  const onClickElement = (evt: any, elem: any) => {
    console.log("evt & element from click event", evt, elem);
    setClickedElement(elem);
    openModal();
  };

  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els: Elements<any>) => removeElements(elementsToRemove, els));

  const onConnect = (params: Connection | Edge) =>
    setElements((els: Elements<any>) => addEdge(params, els));

  let nodeLabel = defaultPythonFnLabel;
  let nodeType = defaultPythonFnType;

  if (clickedElement) {
    if ("data" in clickedElement) {
      if ("label" in clickedElement.data && "type" in clickedElement.data) {
        if (
          clickedElement.data.label !== undefined &&
          clickedElement.data.type !== undefined
        ) {
          nodeLabel = clickedElement.data.func;
          nodeType = clickedElement.data.type;
        }
      }
    }
  }

  const pythonString =
    nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
      ? "..."
      : PYTHON_FUNCTIONS[nodeType][nodeLabel + ".py"];

  let nd: any = {};

  if (results && "io" in results) {
    const runResults = JSON.parse(results.io);
    const filteredResult = runResults.filter(
      (node: any) => node.cmd === nodeLabel
    )[0];
    
    nd = filteredResult === undefined ? {} : filteredResult;
  }

  const defaultLayout = styledPlotLayout(theme);

  const ReactFlowProviderAny: any = ReactFlowProvider;
  const onLoad: OnLoadFunc = (rfIns: OnLoadParams) => {
    console.log(" loaded rfInstance: ", rfIns.toObject());
    rfIns.fitView();
    
    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    
    rfIns.setTransform({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });

    setRfInstance(rfIns.toObject());
  };

  console.log(" rfInstance: ", rfInstance);

  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);

  return (
    <ReactFlowProviderAny>
      <div style={{ height: `99vh` }} data-testid="react-flow">
        <ReactFlow
          elements={elements}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          onElementClick={(evt, elem) => onClickElement(evt, elem)}
        />
      </div>

      <NodeModal
        afterOpenModal={afterOpenModal}
        clickedElement={clickedElement}
        closeModal={closeModal}
        defaultLayout={defaultLayout}
        modalIsOpen={modalIsOpen}
        modalStyles={modalStyles}
        nd={nd}
        nodeLabel={nodeLabel}
        nodeType={nodeType}
        pythonString={pythonString}
        theme={theme}
      />
    </ReactFlowProviderAny>
  );
};

export default FlowChartTab;
