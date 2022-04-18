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

import Plot from 'react-plotly.js';

import CustomEdge from './CustomEdge.tsx';
import CustomNode from './CustomNode.tsx';
import Controls from './ControlBar.tsx';

import Modal from 'react-modal';

import {NOISY_SINE} from './RECIPES.js'
import STATUS_CODES from './../../STATUS_CODES.json';
import PYTHON_FUNCTIONS from './pythonFunctions.json';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco,  srcery} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const initialElements: Elements = NOISY_SINE.elements;

const edgeTypes: EdgeTypesType = {default: CustomEdge};
const nodeTypes: NodeTypesType = {default: CustomNode};

const FlowChart = ({ results, theme }) => {

  console.log('FlowChart RESULTS', results)
  
  const [rfInstance, setRfInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);
  const [clickedElement, setClickedElement] = useState(null);

  const [modalIsOpen, setIsModalOpen] = useState(false);

  const modalStyles = {
      overlay: {zIndex: 99},
      content: {zIndex: 100}
    };
  
  const openModal = () => { setIsModalOpen(true); }
  const afterOpenModal = () => {}
  const closeModal = () => { setIsModalOpen(false); }


  const onClickElement = (evt, elem) => {
    console.log('evt & element from click event', evt, elem);
    setClickedElement(elem);
    openModal();
  }
  
  const onElementsRemove = (elementsToRemove: Elements) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Connection | Edge) => setElements((els) => addEdge(params, els));

  const defaultLabel = 'PYTHON FUNCTION';
  const defaultType = 'PYTHON FUNCTION TYPE';
  
  let nodeLabel = defaultLabel;
  let nodeType = defaultType;

  if (clickedElement != undefined) {
    if ('data' in clickedElement) {
      if ('label' in clickedElement.data && 'type' in clickedElement.data)  {
        if (clickedElement.data.label != undefined && clickedElement.data.type != undefined) {
          nodeLabel = clickedElement.data.label;
          nodeType = clickedElement.data.type;
        }
      }
    }
  }

  const pythonString = (nodeLabel === defaultLabel || nodeType === defaultType)
    ? '...'
    : PYTHON_FUNCTIONS[nodeType][nodeLabel+'.py'];

  let nd = {};

  if ('io' in results) {
    const runResults = JSON.parse(results.io);
    console.log(runResults);
    console.log('nodeLabel', nodeLabel);
    nd = runResults.filter(node => (node.cmd === nodeLabel))[0]
    console.log(nd);
    if(nd == undefined){
      nd = {};
    }
  }

  const plotFeatureColor = (theme === 'light' ? '#282c34' : '#fff');
  const plotBackgroundColor  = (theme === 'light' ? '#fff' : '#282c34');

  const dfltLayout = {
    paper_bgcolor: 'rgba(0,0,0,0)', 
    plot_bgcolor: plotBackgroundColor,
    autosize: true, 
    font: {color: plotFeatureColor},
    margin: {t: 40, r: 20, b: 40, l: 10},
    xaxis: {zeroline: false, color: plotFeatureColor},
    yaxis: {zeroline: false, color: plotFeatureColor}
  };

  return (
    <ReactFlowProvider>
      <Controls 
        rfInstance={rfInstance} 
        setElements={setElements} 
        clickedElement={clickedElement}
        onElementsRemove={onElementsRemove}
        theme={theme}
      >
      </Controls>  
      <div style={{ height: `99vh` }}>
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={modalStyles}
        ariaHideApp={false}
        contentLabel=''
      >               
        <button onClick={closeModal} className='ctrl-close-btn'>x</button>

        {(nodeLabel != undefined && nodeType != undefined) && (
          <div>
            <h1>{nodeLabel}</h1>
            <h4>Function type: <code>{nodeType}</code></h4>
          </div>      
        )}

        {Object.keys(nd).length === 0
          ? <p><code>{nodeLabel}</code> not run yet - click <i>Run Script</i>.</p>
          : (<div>
              <Plot
                data = {'data' in nd.result 
                  ? nd.result.data 
                  : [{'x': nd.result['x0'], 'y': nd.result['y0'] }]}
                layout = {'layout' in nd.result 
                  ? Object.assign({}, nd.result.layout, dfltLayout)
                  : Object.assign({}, {title: `${nd.cmd}`}, dfltLayout)}
                useResizeHandler />                
            </div>)
        }

        <h3>Python code</h3>
        <SyntaxHighlighter language="python" style={theme === 'dark' ? srcery : docco}>
          {pythonString}
        </SyntaxHighlighter>

        <h3>Node data</h3>
        <SyntaxHighlighter language="json" style={theme === 'dark' ? srcery : docco}>
          {`${JSON.stringify(clickedElement, undefined, 4)}`}
          </SyntaxHighlighter>
      </Modal>      
    </ReactFlowProvider>
  );
};

export default FlowChart;