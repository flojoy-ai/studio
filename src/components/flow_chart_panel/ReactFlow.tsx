import React, { useState, useEffect } from "react";
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

import Plot from "react-plotly.js";

import CustomEdge from "./CustomEdge";
import CustomNode from "./CustomNode";

import Modal from "react-modal";

import PYTHON_FUNCTIONS from "./pythonFunctions.json";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco, srcery } from "react-syntax-highlighter/dist/esm/styles/hljs";

import styledPlotLayout from "./../defaultPlotLayout";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import { useWindowSize } from "react-use";

localforage.config({
  name: "react-flow",
  storeName: "flows",
});

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomNode as any };

const FlowChart = ({
  results,
  theme,
  rfInstance,
  setRfInstance,
  elements,
  setElements,
  clickedElement,
  setClickedElement,
}) => {
  // const [clickedElement, setClickedElement] = useState<any>(null);
  const {width:windowWidth} = useWindowSize()
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const modalStyles = {
    overlay: { zIndex: 99 },
    content: { zIndex: 100 },
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const afterOpenModal = () => {};
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClickElement = (evt, elem) => {
    console.log("evt & element from click event", evt, elem);
    setClickedElement(elem);
    openModal();
  };

  const onElementsRemove = (elementsToRemove: Elements) =>
    setElements((els: Elements<any>) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) =>
    setElements((els: Elements<any>) => addEdge(params, els));

  useEffect(() => {
    console.log("ReactFlow component did mount");
    saveFlowChartToLocalStorage(rfInstance);
  });

  const defaultPythonFnLabel = "PYTHON FUNCTION";
  const defaultPythonFnType = "PYTHON FUNCTION TYPE";

  let nodeLabel = defaultPythonFnLabel;
  let nodeType = defaultPythonFnType;

  if (clickedElement !== undefined) {
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

  if ("io" in results) {
    const runResults = JSON.parse(results.io);
    const filteredResult = runResults.filter(
      (node) => node.cmd === nodeLabel
    )[0];
    nd = filteredResult === undefined ? {} : filteredResult;
  }

  const dfltLayout = styledPlotLayout(theme);

  const ReactFlowProviderAny: any = ReactFlowProvider;
  const onLoad: OnLoadFunc = (rfIns: OnLoadParams) => {
    rfIns.fitView();
    const flowSize = 1107;
    const xPosition =windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    rfIns.setTransform({
      x: xPosition,
      y: 22,
      zoom: 0.8
    })
    setRfInstance(rfIns.toObject());
  };

  return (
    <ReactFlowProviderAny>
      <div style={{ height: `99vh` }}>
        <ReactFlow
          elements={elements}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onLoad={onLoad}
          onElementClick={(evt, elem) => onClickElement(evt, elem)}
        ></ReactFlow>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel=""
      >
        <button onClick={closeModal} className="ctrl-close-btn">
          x
        </button>

        {nodeLabel !== undefined && nodeType !== undefined && (
          <div>
            <h1>{nodeLabel}</h1>
            <h4>
              Function type: <code>{nodeType}</code>
            </h4>
          </div>
        )}

        {Object.keys(nd).length === 0 || !nd.result ? (
          <p>
            <code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.
          </p>
        ) : (
          <div id={nd.id}>
            <Plot
              data={
                "data" in nd.result
                  ? nd.result.data
                  : [{ x: nd.result["x0"], y: nd.result["y0"] }]
              }
              layout={
                "layout" in nd.result
                  ? Object.assign({}, nd.result.layout, dfltLayout)
                  : Object.assign({}, { title: `${nd.cmd}` }, dfltLayout)
              }
              useResizeHandler
            />
          </div>
        )}

        <h3>Python code</h3>
        <SyntaxHighlighter
          language="python"
          style={theme === "dark" ? srcery : docco}
        >
          {pythonString}
        </SyntaxHighlighter>

        <h3>Node data</h3>
        <SyntaxHighlighter
          language="json"
          style={theme === "dark" ? srcery : docco}
        >
          {`${JSON.stringify(clickedElement, undefined, 4)}`}
        </SyntaxHighlighter>
      </Modal>
    </ReactFlowProviderAny>
  );
};

export default FlowChart;
