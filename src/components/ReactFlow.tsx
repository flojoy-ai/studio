import React, { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  Elements,
  EdgeTypesType,
  Connection,
  ConnectionLineType,
  Edge,
  OnLoadParams,
} from 'react-flow-renderer';

import CustomEdge from './CustomEdge.tsx';
import CustomNode from './CustomNode.tsx';
import Controls from './ControlBar.tsx';

import {NOISY_SINE} from './../RECIPES.js'

const initialElements: Elements = NOISY_SINE.elements;

const edgeTypes: EdgeTypesType = {default: CustomEdge};
const nodeTypes: NodeTypesType = {default: CustomNode};


const FlowChart = () => {
  
  const [rfInstance, setRfInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const [clickedElement, setClickedElement] = useState(null)

  const onClickElement = (evt, elem) => {
    console.log('evt & element from click event', evt, elem);
    setClickedElement(elem);
  }
  
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <Controls 
        rfInstance={rfInstance} 
        setElements={setElements} 
        clickedElement={clickedElement}
        onElementsRemove={onElementsRemove}
      >
      </Controls>  
      <div style={{ height: `100vh` }}>
        <ReactFlow           
          elements={elements} 
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          onElementsRemove={onElementsRemove} 
          onConnect={onConnect} 
          onLoad={setRfInstance}
          onElementClick={(evt, elem) => onClickElement(evt, elem)}  
        >
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowChart;